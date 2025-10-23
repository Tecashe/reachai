"""
Ultimate LinkedIn Profile Scraper
Production-ready scraper with anti-bot detection and AI extraction
"""

from playwright.async_api import async_playwright
from typing import Dict, List, Optional
import asyncio
import json
import re
import random
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import logging
from dataclasses import dataclass
import anthropic
import os

logger = logging.getLogger(__name__)

@dataclass
class ScrapedProfile:
    name: str
    headline: str
    location: Optional[str]
    current_company: Optional[str]
    current_role: Optional[str]
    experience: List[Dict]
    education: List[Dict]
    skills: List[str]
    about: Optional[str]
    recent_posts: List[Dict]
    recommendations: int
    connections: Optional[str]
    profile_strength: str
    raw_html: str
    screenshot_path: Optional[str]


class UltimateLinkedInScraper:
    """
    Advanced LinkedIn scraper with stealth mode and AI extraction.
    Handles JavaScript rendering, anti-bot detection, and dynamic content.
    """
    
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")
        self.anthropic = anthropic.Anthropic(api_key=api_key)
        
    async def scrape_profile(
        self, 
        url: str, 
        use_ai_extraction: bool = True,
        take_screenshot: bool = False
    ) -> ScrapedProfile:
        """
        Scrapes a LinkedIn profile with AI-powered extraction.
        
        Args:
            url: LinkedIn profile URL
            use_ai_extraction: Use Claude for intelligent extraction (recommended)
            take_screenshot: Save screenshot of profile
            
        Returns:
            ScrapedProfile object with all extracted data
        """
        
        async with async_playwright() as p:
            # Launch browser with stealth configuration
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                    '--disable-gpu'
                ]
            )
            
            # Create context with realistic fingerprint
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                locale='en-US',
                timezone_id='America/New_York',
            )
            
            # Add stealth scripts to avoid detection
            await context.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                });
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5]
                });
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en']
                });
            """)
            
            page = await context.new_page()
            
            try:
                logger.info(f"Navigating to: {url}")
                
                # Navigate with realistic behavior
                await page.goto(url, wait_until='networkidle', timeout=30000)
                
                # Simulate human behavior
                await self._simulate_human_behavior(page)
                
                # Wait for dynamic content to load
                await page.wait_for_timeout(2000)
                
                # Scroll to load lazy content
                await self._scroll_page(page)
                
                # Get page content
                html = await page.content()
                
                # Take screenshot if requested
                screenshot_path = None
                if take_screenshot:
                    screenshot_path = f"/tmp/linkedin_{urlparse(url).path.split('/')[-1]}.png"
                    await page.screenshot(path=screenshot_path, full_page=True)
                    logger.info(f"Screenshot saved: {screenshot_path}")
                
                # Close browser
                await browser.close()
                
                # Extract data
                if use_ai_extraction:
                    return await self._extract_with_ai(html, url, screenshot_path)
                else:
                    return await self._extract_with_selectors(html, url, screenshot_path)
                    
            except Exception as e:
                logger.error(f"Scraping failed: {e}")
                await browser.close()
                raise
    
    async def _simulate_human_behavior(self, page):
        """Simulate human mouse movements to avoid bot detection"""
        try:
            for _ in range(3):
                x = random.randint(100, 800)
                y = random.randint(100, 600)
                await page.mouse.move(x, y)
                await page.wait_for_timeout(random.randint(100, 500))
        except Exception as e:
            logger.warning(f"Human behavior simulation failed: {e}")
    
    async def _scroll_page(self, page):
        """Scroll page like a human to trigger lazy loading"""
        try:
            # Get page height
            page_height = await page.evaluate('document.body.scrollHeight')
            viewport_height = page.viewport_size['height']
            
            # Scroll down in chunks
            current_position = 0
            while current_position < page_height:
                scroll_distance = random.randint(300, 600)
                await page.evaluate(f'window.scrollTo(0, {current_position + scroll_distance})')
                await page.wait_for_timeout(random.randint(500, 1500))
                current_position += scroll_distance
            
            # Scroll back up a bit (humans do this)
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight / 2)')
            await page.wait_for_timeout(1000)
        except Exception as e:
            logger.warning(f"Page scrolling failed: {e}")
    
    async def _extract_with_ai(
        self, 
        html: str, 
        url: str, 
        screenshot_path: Optional[str]
    ) -> ScrapedProfile:
        """
        Use Claude to extract structured data from HTML.
        This is the secret sauce - AI understands page structure even when LinkedIn changes it.
        """
        
        logger.info("Extracting data with AI (Claude)")
        
        # Clean HTML (remove scripts, styles)
        soup = BeautifulSoup(html, 'html.parser')
        for script in soup(["script", "style", "noscript"]):
            script.decompose()
        clean_html = soup.get_text(separator='\n', strip=True)
        
        # Truncate if too long (Claude has token limits)
        if len(clean_html) > 100000:
            clean_html = clean_html[:100000]
            logger.warning("HTML truncated to 100k characters")
        
        # AI extraction prompt
        prompt = f"""Extract structured information from this LinkedIn profile HTML content.

URL: {url}

HTML Content:
{clean_html}

Return a JSON object with this EXACT structure (no additional fields):
{{
    "name": "Full name",
    "headline": "Professional headline",
    "location": "City, Country",
    "current_company": "Current company name or null",
    "current_role": "Current job title or null",
    "experience": [
        {{
            "company": "Company name",
            "title": "Job title",
            "duration": "Jan 2020 - Present",
            "description": "What they did"
        }}
    ],
    "education": [
        {{
            "school": "University name",
            "degree": "Degree type",
            "field": "Field of study",
            "year": "2015-2019"
        }}
    ],
    "skills": ["Skill 1", "Skill 2", "Skill 3"],
    "about": "About section text or null",
    "recent_posts": [
        {{
            "text": "Post content",
            "date": "Posted date",
            "engagement": "likes/comments"
        }}
    ],
    "recommendations": 0,
    "connections": "500+" or null,
    "profile_strength": "All-Star" or "Intermediate" or null
}}

Extract as much information as possible. If a field is not found, use null or empty array.
Be thorough - extract ALL experience entries, education, and skills you can find.
Return ONLY the JSON object, no additional text."""
        
        try:
            # Call Claude
            message = self.anthropic.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4000,
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            
            # Parse JSON response
            response_text = message.content[0].text
            
            # Extract JSON (Claude sometimes adds explanation)
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
            else:
                raise ValueError("Could not extract JSON from AI response")
            
            logger.info(f"Successfully extracted profile: {data.get('name', 'Unknown')}")
            
            # Create ScrapedProfile object
            return ScrapedProfile(
                name=data.get('name', 'Unknown'),
                headline=data.get('headline', ''),
                location=data.get('location'),
                current_company=data.get('current_company'),
                current_role=data.get('current_role'),
                experience=data.get('experience', []),
                education=data.get('education', []),
                skills=data.get('skills', []),
                about=data.get('about'),
                recent_posts=data.get('recent_posts', []),
                recommendations=data.get('recommendations', 0),
                connections=data.get('connections'),
                profile_strength=data.get('profile_strength', 'Unknown'),
                raw_html=html,
                screenshot_path=screenshot_path
            )
            
        except Exception as e:
            logger.error(f"AI extraction failed: {e}")
            # Fallback to selector-based extraction
            logger.info("Falling back to selector-based extraction")
            return await self._extract_with_selectors(html, url, screenshot_path)
    
    async def _extract_with_selectors(
        self, 
        html: str, 
        url: str, 
        screenshot_path: Optional[str]
    ) -> ScrapedProfile:
        """
        Fallback: Traditional selector-based extraction.
        Less robust but faster and doesn't require AI API calls.
        """
        
        logger.info("Extracting data with CSS selectors")
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # Extract using common LinkedIn selectors
        # Note: These selectors may break when LinkedIn updates their HTML
        name_elem = soup.select_one('.text-heading-xlarge, .top-card-layout__title, h1')
        name = name_elem.get_text(strip=True) if name_elem else "Unknown"
        
        headline_elem = soup.select_one('.text-body-medium, .top-card-layout__headline, .pv-top-card--list-bullet')
        headline = headline_elem.get_text(strip=True) if headline_elem else ""
        
        location_elem = soup.select_one('.text-body-small, .top-card__subline-item')
        location = location_elem.get_text(strip=True) if location_elem else None
        
        # Basic extraction - would need more sophisticated parsing for full data
        return ScrapedProfile(
            name=name,
            headline=headline,
            location=location,
            current_company=None,
            current_role=None,
            experience=[],
            education=[],
            skills=[],
            about=None,
            recent_posts=[],
            recommendations=0,
            connections=None,
            profile_strength="Unknown",
            raw_html=html,
            screenshot_path=screenshot_path
        )
