"""
News Intelligence Scraper
Aggregates timely intelligence from multiple sources
"""

from typing import Dict, List
import logging
import json
import httpx
from bs4 import BeautifulSoup
import os
from openai import OpenAI

logger = logging.getLogger(__name__)


class NewsIntelligenceScraper:
    """
    Scrapes news, press releases, and social media for timely personalization hooks.
    """
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")
        self.openai = OpenAI(api_key=api_key)
    
    async def get_company_intelligence(self, company_name: str) -> Dict:
        """
        Aggregates intelligence from multiple sources.
        
        Args:
            company_name: Company name to research
            
        Returns:
            Dict with raw intelligence and AI-generated personalization hooks
        """
        
        logger.info(f"Gathering intelligence for: {company_name}")
        
        intelligence = {
            'recent_news': await self._scrape_google_news(company_name),
            'company_name': company_name
        }
        
        # AI synthesizes into personalization hooks
        hooks = await self._generate_hooks(intelligence, company_name)
        
        return {
            'raw_intelligence': intelligence,
            'personalization_hooks': hooks
        }
    
    async def _scrape_google_news(self, company_name: str) -> List[Dict]:
        """
        Scrape Google News for recent articles about the company.
        """
        
        try:
            # Google News RSS feed
            url = f"https://news.google.com/rss/search?q={company_name.replace(' ', '+')}&hl=en-US&gl=US&ceid=US:en"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=10.0)
                response.raise_for_status()
            
            # Parse RSS
            soup = BeautifulSoup(response.text, 'xml')
            items = soup.find_all('item', limit=5)
            
            articles = []
            for item in items:
                articles.append({
                    'title': item.title.text if item.title else '',
                    'link': item.link.text if item.link else '',
                    'published': item.pubDate.text if item.pubDate else '',
                    'source': item.source.text if item.source else ''
                })
            
            logger.info(f"Found {len(articles)} news articles")
            return articles
            
        except Exception as e:
            logger.error(f"Google News scraping failed: {e}")
            return []
    
    async def _generate_hooks(self, intelligence: Dict, company_name: str) -> List[Dict]:
        """
        AI generates specific personalization hooks from intelligence.
        """
        
        logger.info("Generating personalization hooks with AI")
        
        prompt = f"""Based on this intelligence about {company_name}, generate 5-10 specific, timely personalization hooks for cold email outreach.

Intelligence:
{json.dumps(intelligence, indent=2)}

For each hook, provide:
1. The hook (specific fact/event/news)
2. Why it's relevant for outreach
3. Example opening line using this hook

Return as a JSON array with this structure:
[
    {{
        "hook": "Specific fact or event",
        "relevance": "Why this matters for outreach",
        "example_line": "Example opening sentence using this hook"
    }}
]

Focus on recent, timely information that shows you've done research.
Return ONLY the JSON array."""
        
        try:
            response = self.openai.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            hooks = result.get('hooks', [])
            
            logger.info(f"Generated {len(hooks)} personalization hooks")
            return hooks
            
        except Exception as e:
            logger.error(f"Hook generation failed: {e}")
            return []
