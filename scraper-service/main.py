"""
mailfra Advanced Scraper Service
FastAPI service for production-grade web scraping with AI extraction
"""

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict
import logging
import os
from datetime import datetime

from scrapers.linkedin_scraper import UltimateLinkedInScraper
from scrapers.company_scraper import UltimateCompanyScraper
from scrapers.news_scraper import NewsIntelligenceScraper

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="mailfra Scraper Service",
    description="Advanced web scraping with AI-powered extraction",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize scrapers
linkedin_scraper = UltimateLinkedInScraper()
company_scraper = UltimateCompanyScraper()
news_scraper = NewsIntelligenceScraper()

# API Key authentication
API_KEY = os.getenv("SCRAPER_API_KEY", "your-secret-api-key-change-in-production")

def verify_api_key(x_api_key: str = Header(...)):
    """Verify API key for authentication"""
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key


# Request/Response Models
class LinkedInScrapeRequest(BaseModel):
    url: HttpUrl
    use_ai_extraction: bool = True
    take_screenshot: bool = False

class CompanyScrapeRequest(BaseModel):
    url: HttpUrl

class NewsIntelligenceRequest(BaseModel):
    company_name: str

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str


# API Endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }


@app.post("/api/scrape/linkedin")
async def scrape_linkedin_profile(
    request: LinkedInScrapeRequest,
    api_key: str = Header(..., alias="x-api-key")
):
    """
    Scrape LinkedIn profile with AI-powered extraction
    
    Returns structured profile data including:
    - Name, headline, location
    - Current company and role
    - Full experience history
    - Education
    - Skills
    - Recent posts
    - Recommendations and connections
    """
    verify_api_key(api_key)
    
    try:
        logger.info(f"Scraping LinkedIn profile: {request.url}")
        
        profile = await linkedin_scraper.scrape_profile(
            url=str(request.url),
            use_ai_extraction=request.use_ai_extraction,
            take_screenshot=request.take_screenshot
        )
        
        # Convert dataclass to dict
        profile_dict = {
            "name": profile.name,
            "headline": profile.headline,
            "location": profile.location,
            "current_company": profile.current_company,
            "current_role": profile.current_role,
            "experience": profile.experience,
            "education": profile.education,
            "skills": profile.skills,
            "about": profile.about,
            "recent_posts": profile.recent_posts,
            "recommendations": profile.recommendations,
            "connections": profile.connections,
            "profile_strength": profile.profile_strength,
            "screenshot_path": profile.screenshot_path
        }
        
        logger.info(f"Successfully scraped profile: {profile.name}")
        
        return {
            "success": True,
            "data": profile_dict,
            "scraped_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"LinkedIn scraping failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")


@app.post("/api/scrape/company")
async def scrape_company_website(
    request: CompanyScrapeRequest,
    api_key: str = Header(..., alias="x-api-key")
):
    """
    Deep scrape of company website with AI analysis
    
    Returns actionable intelligence including:
    - Products and services
    - Target customers and pain points
    - Pricing model
    - Tech stack
    - Team size and funding
    - Recent launches
    - Competitors
    - Personalization hooks for outreach
    """
    verify_api_key(api_key)
    
    try:
        logger.info(f"Scraping company website: {request.url}")
        
        intelligence = await company_scraper.scrape_company(str(request.url))
        
        logger.info(f"Successfully scraped company: {intelligence.get('company_name', 'Unknown')}")
        
        return {
            "success": True,
            "data": intelligence,
            "scraped_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Company scraping failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")


@app.post("/api/intelligence/news")
async def get_news_intelligence(
    request: NewsIntelligenceRequest,
    api_key: str = Header(..., alias="x-api-key")
):
    """
    Aggregate intelligence from news, social media, and job boards
    
    Returns:
    - Recent news articles
    - Press releases
    - Social media mentions
    - Job postings
    - Product Hunt launches
    - AI-generated personalization hooks
    """
    verify_api_key(api_key)
    
    try:
        logger.info(f"Gathering intelligence for: {request.company_name}")
        
        intelligence = await news_scraper.get_company_intelligence(request.company_name)
        
        logger.info(f"Successfully gathered intelligence for: {request.company_name}")
        
        return {
            "success": True,
            "data": intelligence,
            "scraped_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Intelligence gathering failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Intelligence gathering failed: {str(e)}")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "mailfra Scraper Service",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "health": "/health",
            "linkedin": "/api/scrape/linkedin",
            "company": "/api/scrape/company",
            "news": "/api/intelligence/news"
        }
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # Disable reload in production
        log_level="info"
    )
