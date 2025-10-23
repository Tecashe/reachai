"""
Ultimate Company Website Scraper
Deep intelligence extraction from company websites
"""

from playwright.async_api import async_playwright
from typing import Dict, List
import logging
import json
import re
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
import anthropic
import os

logger = logging.getLogger(__name__)


class UltimateCompanyScraper:
    """
    Scrapes company websites for actionable sales intelligence.
    Visits multiple pages and uses AI to extract insights.
    """
    
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")
        self.anthropic = anthropic.Anthropic(api_key=api_key)
    
    async def scrape_company(self, url: str) -> Dict:
        """
        Deep scrape of company website with AI analysis.
        
        Args:
            url: Company website URL
            
        Returns:
            Dict with company intelligence and personalization hooks
        """
        
        logger.info(f"Starting company scrape: {url}")
        
        # Normalize URL
        if not url.startswith(('http://', 'https://')):
            url = f'https://{url}'
        
        base_url = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            # Pages to scrape for maximum intelligence
            pages_to_scrape = [
                url,
                urljoin(base_url, '/about'),
                urljoin(base_url, '/about-us'),
                urljoin(base_url, '/pricing'),
                urljoin(base_url, '/products'),
                urljoin(base_url, '/solutions'),
                urljoin(base_url, '/team'),
                urljoin(base_url, '/careers'),
                urljoin(base_url, '/jobs'),
                urljoin(base_url, '/blog'),
                urljoin(base_url, '/news'),
                urljoin(base_url, '/press'),
            ]
            
            scraped_data = {}
            
            for page_url in pages_to_scrape:
                try:
                    logger.info(f"Scraping page: {page_url}")
                    await page.goto(page_url, wait_until='networkidle', timeout=15000)
                    
                    # Wait for content
                    await page.wait_for_timeout(1000)
                    
                    # Get HTML
                    html = await page.content()
                    
                    # Clean HTML
                    soup = BeautifulSoup(html, 'html.parser')
                    for script in soup(["script", "style", "noscript"]):
                        script.decompose()
                    clean_text = soup.get_text(separator='\n', strip=True)
                    
                    # Store with page name
                    page_name = urlparse(page_url).path.strip('/') or 'home'
                    scraped_data[page_name] = clean_text[:20000]  # Limit per page
                    
                    logger.info(f"Successfully scraped: {page_name}")
                    
                except Exception as e:
                    logger.warning(f"Failed to scrape {page_url}: {e}")
                    continue
            
            await browser.close()
            
            if not scraped_data:
                raise ValueError("No pages could be scraped")
            
            # Use AI to extract intelligence
            intelligence = await self._analyze_with_ai(scraped_data, url)
            
            return intelligence
    
    async def _analyze_with_ai(self, pages: Dict[str, str], url: str) -> Dict:
        """
        AI analyzes all scraped pages and extracts actionable intelligence.
        """
        
        logger.info("Analyzing scraped content with AI")
        
        # Combine all page content
        combined_content = "\n\n---PAGE BREAK---\n\n".join(
            f"PAGE: {name}\n{content}" for name, content in pages.items()
        )
        
        # Truncate if too long
        if len(combined_content) > 150000:
            combined_content = combined_content[:150000]
            logger.warning("Combined content truncated to 150k characters")
        
        prompt = f"""Analyze this company website and extract actionable intelligence for B2B sales outreach.

Company URL: {url}

Website Content:
{combined_content}

Extract the following information in JSON format:
{{
    "company_name": "Official company name",
    "tagline": "Their main value proposition",
    "industry": "Industry/sector",
    "products": ["Product 1", "Product 2"],
    "target_customers": ["ICP 1", "ICP 2"],
    "pain_points_solved": ["Pain point 1", "Pain point 2"],
    "pricing_model": "How they charge (subscription, one-time, enterprise, etc.)",
    "tech_stack": ["Technology 1", "Technology 2"],
    "team_size": "Estimated team size",
    "funding_stage": "Series A/B/C, Bootstrapped, or Unknown",
    "recent_launches": ["Recent product/feature launches"],
    "hiring_for": ["Roles they're hiring for"],
    "competitors": ["Competitor 1", "Competitor 2"],
    "key_executives": ["Name - Title"],
    "company_culture": "Brief description of culture/values",
    "social_proof": ["Customer logos, testimonials, case studies mentioned"],
    "personalization_hooks": [
        "Hook 1: Specific, actionable insight for cold email",
        "Hook 2: Another angle for personalization"
    ]
}}

Be thorough and extract ACTIONABLE insights. Focus on information that would help personalize a cold email.
If information is not found, use null or empty array. Return ONLY the JSON object."""
        
        try:
            # Call Claude
            message = self.anthropic.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Parse response
            response_text = message.content[0].text
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            
            if json_match:
                intelligence = json.loads(json_match.group())
                logger.info(f"Successfully analyzed company: {intelligence.get('company_name', 'Unknown')}")
                return intelligence
            else:
                raise ValueError("Could not extract JSON from AI response")
                
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            # Return basic fallback data
            return {
                "company_name": urlparse(url).netloc,
                "error": str(e),
                "raw_pages": list(pages.keys())
            }
