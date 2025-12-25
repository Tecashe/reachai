// // lib/seo-config.ts

// /**
//  * SEO Configuration for Guide Pages
//  * Optimized for maximum search engine visibility and ranking
//  */

// export const seoConfig = {
//   // Primary target keywords for each guide
//   targetKeywords: {
//     'cold-email-masterclass': [
//       'cold email guide',
//       'cold email outreach',
//       'b2b cold email',
//       'cold email templates',
//       'cold email best practices',
//       'email prospecting guide',
//       'cold email strategy',
//       'how to write cold emails',
//       'cold email for sales',
//       'cold email deliverability'
//     ],
//     'deliverability-deep-dive': [
//       'email deliverability',
//       'spf dkim dmarc',
//       'email authentication',
//       'inbox placement',
//       'email deliverability guide',
//       'improve email deliverability',
//       'email spam prevention',
//       'email warmup',
//       'sender reputation',
//       'email deliverability best practices'
//     ],
//     'agency-growth-playbook': [
//       'agency growth strategies',
//       'digital agency growth',
//       'agency lead generation',
//       'how to grow an agency',
//       'agency outreach strategies',
//       'agency client acquisition',
//       'marketing agency playbook',
//       'agency business development',
//       'white label cold email',
//       'agency scaling strategies'
//     ],
//     'b2b-sales-automation': [
//       'b2b sales automation',
//       'sales automation tools',
//       'sales process automation',
//       'automate sales pipeline',
//       'crm automation',
//       'sales workflow automation',
//       'lead scoring automation',
//       'automated email sequences',
//       'sales automation software',
//       'b2b automation strategies'
//     ]
//   },

//   // Long-tail keywords for each guide (these rank easier and convert better)
//   longTailKeywords: {
//     'cold-email-masterclass': [
//       'how to write a cold email that gets responses',
//       'cold email templates that work',
//       'best cold email subject lines',
//       'cold email follow up sequence',
//       'how to personalize cold emails at scale',
//       'cold email open rate benchmarks',
//       'spf dkim setup for cold email',
//       'how to warm up email domain',
//       'cold email vs linkedin outreach',
//       'cold email for saas companies'
//     ],
//     'deliverability-deep-dive': [
//       'how to set up spf dkim dmarc',
//       'why are my emails going to spam',
//       'how to improve email deliverability',
//       'google workspace dkim setup',
//       'microsoft 365 spf configuration',
//       'email warmup best practices',
//       'how to check email deliverability',
//       'email authentication checklist',
//       'domain warmup process',
//       'email reputation monitoring tools'
//     ],
//     'agency-growth-playbook': [
//       'how to get clients for digital agency',
//       'agency cold outreach templates',
//       'how to scale a marketing agency',
//       'agency ideal customer profile',
//       'white label email marketing',
//       'agency client onboarding process',
//       'how to price agency services',
//       'agency multi-channel outreach',
//       'cold email for agencies',
//       'agency growth tactics that work'
//     ]
//   },

//   // Semantic keywords (related terms that help Google understand context)
//   semanticKeywords: {
//     'cold-email-masterclass': [
//       'outbound sales',
//       'prospecting',
//       'lead generation',
//       'email marketing',
//       'sales development',
//       'outreach strategy',
//       'b2b marketing',
//       'email campaigns',
//       'sales automation',
//       'pipeline generation'
//     ],
//     'deliverability-deep-dive': [
//       'email infrastructure',
//       'dns configuration',
//       'mail server',
//       'email protocol',
//       'sender authentication',
//       'anti-spam',
//       'email security',
//       'isp',
//       'mail transfer agent',
//       'email headers'
//     ]
//   }
// }

// // Meta descriptions optimized for CTR
// export const metaDescriptions = {
//   'cold-email-masterclass': 
//     'Master cold email with our comprehensive guide. Learn technical setup (SPF/DKIM/DMARC), copywriting, personalization & scaling strategies that generate 42:1 ROI. 12 chapters. 2025 updated.',
  
//   'deliverability-deep-dive':
//     'Complete email deliverability guide. Step-by-step SPF, DKIM, DMARC setup, domain warmup strategies & inbox placement optimization. Reach the inbox every time. 2025 updated.',
  
//   'agency-growth-playbook':
//     'Scale your agency with proven cold outreach strategies. ICP definition, multi-channel approach, white-label services, pricing & client acquisition. 10 chapters of actionable tactics.',
  
//   'b2b-sales-automation':
//     'Automate your B2B sales pipeline from prospecting to booking meetings. CRM integration, lead scoring, trigger-based sequences & ROI measurement. Complete automation guide.'
// }

// // Structured data schemas for rich snippets
// export const generateArticleSchema = (guide: any, slug: string) => ({
//   '@context': 'https://schema.org',
//   '@type': 'Article',
//   headline: guide.title,
//   description: guide.description,
//   image: `https://yoursite.com/images/guides/${slug}-og.jpg`,
//   datePublished: guide.publishDate,
//   dateModified: guide.lastModified,
//   author: {
//     '@type': 'Person',
//     name: guide.author.name,
//     jobTitle: guide.author.role,
//     url: `https://yoursite.com/authors/${guide.author.slug}`
//   },
//   publisher: {
//     '@type': 'Organization',
//     name: 'Your Company Name',
//     logo: {
//       '@type': 'ImageObject',
//       url: 'https://yoursite.com/logo.png',
//       width: 600,
//       height: 60
//     }
//   },
//   mainEntityOfPage: {
//     '@type': 'WebPage',
//     '@id': `https://yoursite.com/guides/${slug}`
//   },
//   articleSection: 'Guides',
//   wordCount: guide.wordCount,
//   timeRequired: `PT${guide.readTime}M`,
//   keywords: seoConfig.targetKeywords[slug].join(', ')
// })

// export const generateHowToSchema = (guide: any, slug: string) => ({
//   '@context': 'https://schema.org',
//   '@type': 'HowTo',
//   name: guide.title,
//   description: guide.description,
//   image: `https://yoursite.com/images/guides/${slug}-og.jpg`,
//   totalTime: `PT${guide.readTime}M`,
//   estimatedCost: {
//     '@type': 'MonetaryAmount',
//     currency: 'USD',
//     value: '0'
//   },
//   step: guide.chapters.map((chapter: any, index: number) => ({
//     '@type': 'HowToStep',
//     name: chapter.title,
//     text: chapter.intro,
//     position: index + 1,
//     url: `https://yoursite.com/guides/${slug}#chapter-${chapter.id}`
//   }))
// })

// export const generateFAQSchema = (faqItems: any[]) => ({
//   '@context': 'https://schema.org',
//   '@type': 'FAQPage',
//   mainEntity: faqItems.map(item => ({
//     '@type': 'Question',
//     name: item.question,
//     acceptedAnswer: {
//       '@type': 'Answer',
//       text: item.answer
//     }
//   }))
// })

// export const generateBreadcrumbSchema = (slug: string, title: string) => ({
//   '@context': 'https://schema.org',
//   '@type': 'BreadcrumbList',
//   itemListElement: [
//     {
//       '@type': 'ListItem',
//       position: 1,
//       name: 'Home',
//       item: 'https://yoursite.com'
//     },
//     {
//       '@type': 'ListItem',
//       position: 2,
//       name: 'Guides',
//       item: 'https://yoursite.com/guides'
//     },
//     {
//       '@type': 'ListItem',
//       position: 3,
//       name: title,
//       item: `https://yoursite.com/guides/${slug}`
//     }
//   ]
// })

// // Open Graph images optimized for social sharing
// export const ogImageConfig = {
//   width: 1200,
//   height: 630,
//   // Template for dynamic OG images
//   generateOGImage: (title: string, description: string, chapterCount: number) => ({
//     title: {
//       text: title,
//       fontSize: 64,
//       fontWeight: 'bold',
//       color: '#1a1a1a'
//     },
//     subtitle: {
//       text: `${chapterCount} Chapters • Complete Guide`,
//       fontSize: 24,
//       color: '#666666'
//     },
//     description: {
//       text: description,
//       fontSize: 28,
//       color: '#333333',
//       maxLines: 2
//     },
//     branding: {
//       logo: '/logo.png',
//       position: 'bottom-left'
//     },
//     background: {
//       gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//     }
//   })
// }

// // Internal linking structure for SEO
// export const internalLinks = {
//   'cold-email-masterclass': [
//     {
//       text: 'Email deliverability guide',
//       url: '/guides/deliverability-deep-dive',
//       context: 'chapter-3' // Link from chapter 3
//     },
//     {
//       text: 'Agency growth strategies',
//       url: '/guides/agency-growth-playbook',
//       context: 'chapter-11'
//     },
//     {
//       text: 'Sales automation tools',
//       url: '/guides/b2b-sales-automation',
//       context: 'chapter-12'
//     }
//   ],
//   'deliverability-deep-dive': [
//     {
//       text: 'Cold email best practices',
//       url: '/guides/cold-email-masterclass',
//       context: 'chapter-1'
//     },
//     {
//       text: 'Domain warmup strategies',
//       url: '/guides/cold-email-masterclass#chapter-4',
//       context: 'chapter-5'
//     }
//   ]
// }

// // Content optimization checklist
// export const contentOptimizationChecklist = {
//   perChapter: [
//     '✓ H2 heading includes target keyword',
//     '✓ First 100 words include primary keyword',
//     '✓ Keyword density 1-2% (natural usage)',
//     '✓ Internal link to related guide',
//     '✓ At least one external authority link',
//     '✓ Image with descriptive alt text',
//     '✓ Actionable takeaways section',
//     '✓ Examples or case studies included'
//   ],
//   perGuide: [
//     '✓ Title includes primary keyword (front-loaded)',
//     '✓ Meta description 150-160 characters',
//     '✓ URL slug matches title keyword',
//     '✓ Table of contents with anchor links',
//     '✓ FAQ section at bottom',
//     '✓ Related guides section',
//     '✓ Author bio with expertise',
//     '✓ Last updated date displayed',
//     '✓ Social sharing buttons',
//     '✓ Download PDF option',
//     '✓ Email capture for follow-up content',
//     '✓ Schema markup (Article, HowTo, FAQ)',
//     '✓ Mobile-responsive design',
//     '✓ Fast page load (<3 seconds)',
//     '✓ Accessible (WCAG 2.1 AA)'
//   ]
// }

// // Recommended internal anchor text for backlinking
// export const anchorTextVariations = {
//   'cold-email-masterclass': [
//     'cold email guide',
//     'learn cold email',
//     'cold email best practices',
//     'complete cold email guide',
//     'cold email masterclass',
//     'how to do cold email',
//     'cold email strategies'
//   ],
//   'deliverability-deep-dive': [
//     'email deliverability guide',
//     'improve email deliverability',
//     'deliverability best practices',
//     'email authentication setup',
//     'inbox placement guide',
//     'email deliverability tips'
//   ]
// }

// // Content refresh schedule
// export const contentRefreshSchedule = {
//   quarterly: [
//     'Update statistics and data',
//     'Add new tool recommendations',
//     'Refresh examples with recent cases',
//     'Check and fix broken links'
//   ],
//   annually: [
//     'Major content overhaul',
//     'Add new chapters if needed',
//     'Update all screenshots',
//     'Rewrite outdated sections',
//     'Expand FAQ based on common questions'
//   ]
// }

// // Export everything for easy import
// export default {
//   seoConfig,
//   metaDescriptions,
//   generateArticleSchema,
//   generateHowToSchema,
//   generateFAQSchema,
//   generateBreadcrumbSchema,
//   ogImageConfig,
//   internalLinks,
//   contentOptimizationChecklist,
//   anchorTextVariations,
//   contentRefreshSchedule
// }
// lib/seo-config.ts

/**
 * SEO Configuration for Guide Pages
 * Optimized for maximum search engine visibility and ranking
 */

// Define valid guide slugs as a type
export type GuideSlug = 
  | 'cold-email-masterclass'
  | 'deliverability-deep-dive'
  | 'agency-growth-playbook'
  | 'b2b-sales-automation'
  | 'linkedin-outreach-guide'
  | 'sales-copywriting-101'
  | 'b2b-lead-generation'

// Type-safe keyword configuration
export const seoConfig = {
  // Primary target keywords for each guide
  targetKeywords: {
    'cold-email-masterclass': [
      'cold email guide',
      'cold email outreach',
      'b2b cold email',
      'cold email templates',
      'cold email best practices',
      'email prospecting guide',
      'cold email strategy',
      'how to write cold emails',
      'cold email for sales',
      'cold email deliverability'
    ],
    'deliverability-deep-dive': [
      'email deliverability',
      'spf dkim dmarc',
      'email authentication',
      'inbox placement',
      'email deliverability guide',
      'improve email deliverability',
      'email spam prevention',
      'email warmup',
      'sender reputation',
      'email deliverability best practices'
    ],
    'agency-growth-playbook': [
      'agency growth strategies',
      'digital agency growth',
      'agency lead generation',
      'how to grow an agency',
      'agency outreach strategies',
      'agency client acquisition',
      'marketing agency playbook',
      'agency business development',
      'white label cold email',
      'agency scaling strategies'
    ],
    'b2b-sales-automation': [
      'b2b sales automation',
      'sales automation tools',
      'sales process automation',
      'automate sales pipeline',
      'crm automation',
      'sales workflow automation',
      'lead scoring automation',
      'automated email sequences',
      'sales automation software',
      'b2b automation strategies'
    ],
    'linkedin-outreach-guide': [
      'linkedin outreach',
      'linkedin prospecting',
      'linkedin sales navigator',
      'linkedin messaging strategy',
      'b2b linkedin outreach',
      'linkedin connection requests',
      'linkedin lead generation',
      'social selling guide',
      'linkedin outreach templates',
      'linkedin sales strategy'
    ],
    'sales-copywriting-101': [
      'sales copywriting',
      'email copywriting',
      'persuasive writing',
      'sales email templates',
      'copywriting for sales',
      'conversion copywriting',
      'sales messaging',
      'cold email copy',
      'sales copy formulas',
      'email subject lines'
    ],
    'b2b-lead-generation': [
      'b2b lead generation',
      'lead generation strategies',
      'b2b marketing',
      'lead gen tactics',
      'multi-channel marketing',
      'b2b prospecting',
      'lead generation guide',
      'qualified lead generation',
      'b2b sales leads',
      'lead generation best practices'
    ]
  } as Record<GuideSlug, string[]>,

  // Long-tail keywords for each guide (these rank easier and convert better)
  longTailKeywords: {
    'cold-email-masterclass': [
      'how to write a cold email that gets responses',
      'cold email templates that work',
      'best cold email subject lines',
      'cold email follow up sequence',
      'how to personalize cold emails at scale',
      'cold email open rate benchmarks',
      'spf dkim setup for cold email',
      'how to warm up email domain',
      'cold email vs linkedin outreach',
      'cold email for saas companies'
    ],
    'deliverability-deep-dive': [
      'how to set up spf dkim dmarc',
      'why are my emails going to spam',
      'how to improve email deliverability',
      'google workspace dkim setup',
      'microsoft 365 spf configuration',
      'email warmup best practices',
      'how to check email deliverability',
      'email authentication checklist',
      'domain warmup process',
      'email reputation monitoring tools'
    ],
    'agency-growth-playbook': [
      'how to get clients for digital agency',
      'agency cold outreach templates',
      'how to scale a marketing agency',
      'agency ideal customer profile',
      'white label email marketing',
      'agency client onboarding process',
      'how to price agency services',
      'agency multi-channel outreach',
      'cold email for agencies',
      'agency growth tactics that work'
    ],
    'linkedin-outreach-guide': [
      'how to do linkedin outreach',
      'linkedin connection request templates',
      'best linkedin outreach messages',
      'how to use sales navigator effectively',
      'linkedin prospecting strategy',
      'how to book meetings on linkedin',
      'linkedin social selling tips',
      'linkedin messaging best practices',
      'how to personalize linkedin messages',
      'linkedin outreach automation tools'
    ],
    'sales-copywriting-101': [
      'how to write sales emails that convert',
      'sales email copywriting tips',
      'best sales email subject lines',
      'email copywriting formulas',
      'how to write persuasive emails',
      'sales copy templates that work',
      'email cta best practices',
      'how to write cold outreach messages',
      'sales messaging framework',
      'conversion-focused email copy'
    ],
    'b2b-lead-generation': [
      'best b2b lead generation strategies',
      'how to generate b2b leads',
      'b2b lead gen tactics that work',
      'multi-channel lead generation approach',
      'b2b lead generation tools',
      'how to build lead generation funnel',
      'b2b marketing lead generation',
      'qualified lead generation strategies',
      'cost per lead benchmarks b2b',
      'lead generation roi calculator'
    ]
  } as Record<GuideSlug, string[]>,

  // Semantic keywords (related terms that help Google understand context)
  semanticKeywords: {
    'cold-email-masterclass': [
      'outbound sales',
      'prospecting',
      'lead generation',
      'email marketing',
      'sales development',
      'outreach strategy',
      'b2b marketing',
      'email campaigns',
      'sales automation',
      'pipeline generation'
    ],
    'deliverability-deep-dive': [
      'email infrastructure',
      'dns configuration',
      'mail server',
      'email protocol',
      'sender authentication',
      'anti-spam',
      'email security',
      'isp',
      'mail transfer agent',
      'email headers'
    ],
    'linkedin-outreach-guide': [
      'social selling',
      'professional networking',
      'b2b social media',
      'digital prospecting',
      'relationship building',
      'linkedin marketing',
      'social media outreach',
      'professional outreach',
      'network expansion',
      'social prospecting'
    ],
    'sales-copywriting-101': [
      'persuasion',
      'conversion optimization',
      'messaging strategy',
      'value proposition',
      'call to action',
      'email marketing',
      'content writing',
      'marketing copy',
      'sales messaging',
      'direct response'
    ],
    'b2b-lead-generation': [
      'demand generation',
      'pipeline building',
      'marketing qualified leads',
      'sales qualified leads',
      'lead nurturing',
      'conversion funnel',
      'customer acquisition',
      'growth marketing',
      'revenue generation',
      'sales enablement'
    ]
  } as Record<GuideSlug, string[]>
}

// Meta descriptions optimized for CTR
export const metaDescriptions: Record<GuideSlug, string> = {
  'cold-email-masterclass': 
    'Master cold email with our comprehensive guide. Learn technical setup (SPF/DKIM/DMARC), copywriting, personalization & scaling strategies that generate 42:1 ROI. 12 chapters. 2025 updated.',
  
  'deliverability-deep-dive':
    'Complete email deliverability guide. Step-by-step SPF, DKIM, DMARC setup, domain warmup strategies & inbox placement optimization. Reach the inbox every time. 2025 updated.',
  
  'agency-growth-playbook':
    'Scale your agency with proven cold outreach strategies. ICP definition, multi-channel approach, white-label services, pricing & client acquisition. 10 chapters of actionable tactics.',
  
  'b2b-sales-automation':
    'Automate your B2B sales pipeline from prospecting to booking meetings. CRM integration, lead scoring, trigger-based sequences & ROI measurement. Complete automation guide.',

  'linkedin-outreach-guide':
    'Master LinkedIn outreach with proven strategies. Profile optimization, Sales Navigator tactics, messaging sequences & content strategy that books 10+ meetings per week. 2025 updated.',

  'sales-copywriting-101':
    'Learn sales copywriting that converts. Psychology principles, proven formulas, subject lines, CTAs & A/B testing strategies. Write emails that generate responses. Complete guide.',

  'b2b-lead-generation':
    'Build a multi-channel B2B lead generation engine. Cold email, LinkedIn, content marketing & paid ads strategies. Generate predictable pipeline. 11 chapters. 2025 updated.'
}

// Type for guide data
interface GuideData {
  title: string
  description: string
  publishDate: string
  lastModified: string
  readTime: number
  chapters: Array<{
    id: number
    title: string
    intro?: string
  }>
  author: {
    name: string
    role: string
    slug?: string
  }
  wordCount?: number
}

// Structured data schemas for rich snippets
export const generateArticleSchema = (guide: GuideData, slug: GuideSlug) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: guide.title,
  description: guide.description,
  image: `https://yoursite.com/images/guides/${slug}-og.jpg`,
  datePublished: guide.publishDate,
  dateModified: guide.lastModified,
  author: {
    '@type': 'Person',
    name: guide.author.name,
    jobTitle: guide.author.role,
    url: `https://yoursite.com/authors/${guide.author.slug || 'default'}`
  },
  publisher: {
    '@type': 'Organization',
    name: 'Your Company Name',
    logo: {
      '@type': 'ImageObject',
      url: 'https://yoursite.com/logo.png',
      width: 600,
      height: 60
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://yoursite.com/guides/${slug}`
  },
  articleSection: 'Guides',
  wordCount: guide.wordCount || 5000,
  timeRequired: `PT${guide.readTime}M`,
  keywords: seoConfig.targetKeywords[slug]?.join(', ') || ''
})

export const generateHowToSchema = (guide: GuideData, slug: GuideSlug) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: guide.title,
  description: guide.description,
  image: `https://yoursite.com/images/guides/${slug}-og.jpg`,
  totalTime: `PT${guide.readTime}M`,
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0'
  },
  step: guide.chapters.map((chapter, index) => ({
    '@type': 'HowToStep',
    name: chapter.title,
    text: chapter.intro || '',
    position: index + 1,
    url: `https://yoursite.com/guides/${slug}#chapter-${chapter.id}`
  }))
})

interface FAQItem {
  question: string
  answer: string
}

export const generateFAQSchema = (faqItems: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
})

export const generateBreadcrumbSchema = (slug: GuideSlug, title: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://yoursite.com'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Guides',
      item: 'https://yoursite.com/guides'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: title,
      item: `https://yoursite.com/guides/${slug}`
    }
  ]
})

// Open Graph images optimized for social sharing
export const ogImageConfig = {
  width: 1200,
  height: 630,
  // Template for dynamic OG images
  generateOGImage: (title: string, description: string, chapterCount: number) => ({
    title: {
      text: title,
      fontSize: 64,
      fontWeight: 'bold',
      color: '#1a1a1a'
    },
    subtitle: {
      text: `${chapterCount} Chapters • Complete Guide`,
      fontSize: 24,
      color: '#666666'
    },
    description: {
      text: description,
      fontSize: 28,
      color: '#333333',
      maxLines: 2
    },
    branding: {
      logo: '/logo.png',
      position: 'bottom-left'
    },
    background: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  })
}

// Internal linking structure for SEO
interface InternalLink {
  text: string
  url: string
  context: string
}

export const internalLinks: Record<GuideSlug, InternalLink[]> = {
  'cold-email-masterclass': [
    {
      text: 'Email deliverability guide',
      url: '/guides/deliverability-deep-dive',
      context: 'chapter-3'
    },
    {
      text: 'Agency growth strategies',
      url: '/guides/agency-growth-playbook',
      context: 'chapter-11'
    },
    {
      text: 'Sales automation tools',
      url: '/guides/b2b-sales-automation',
      context: 'chapter-12'
    },
    {
      text: 'LinkedIn outreach guide',
      url: '/guides/linkedin-outreach-guide',
      context: 'chapter-2'
    }
  ],
  'deliverability-deep-dive': [
    {
      text: 'Cold email best practices',
      url: '/guides/cold-email-masterclass',
      context: 'chapter-1'
    },
    {
      text: 'Domain warmup strategies',
      url: '/guides/cold-email-masterclass#chapter-4',
      context: 'chapter-5'
    }
  ],
  'agency-growth-playbook': [
    {
      text: 'Cold email masterclass',
      url: '/guides/cold-email-masterclass',
      context: 'chapter-3'
    },
    {
      text: 'LinkedIn outreach for agencies',
      url: '/guides/linkedin-outreach-guide',
      context: 'chapter-5'
    }
  ],
  'b2b-sales-automation': [
    {
      text: 'Cold email automation',
      url: '/guides/cold-email-masterclass',
      context: 'chapter-2'
    },
    {
      text: 'Lead generation strategies',
      url: '/guides/b2b-lead-generation',
      context: 'chapter-4'
    }
  ],
  'linkedin-outreach-guide': [
    {
      text: 'Cold email strategies',
      url: '/guides/cold-email-masterclass',
      context: 'chapter-1'
    },
    {
      text: 'Sales copywriting tips',
      url: '/guides/sales-copywriting-101',
      context: 'chapter-4'
    }
  ],
  'sales-copywriting-101': [
    {
      text: 'Cold email templates',
      url: '/guides/cold-email-masterclass',
      context: 'chapter-6'
    },
    {
      text: 'LinkedIn messaging examples',
      url: '/guides/linkedin-outreach-guide',
      context: 'chapter-5'
    }
  ],
  'b2b-lead-generation': [
    {
      text: 'Cold email lead generation',
      url: '/guides/cold-email-masterclass',
      context: 'chapter-3'
    },
    {
      text: 'LinkedIn prospecting',
      url: '/guides/linkedin-outreach-guide',
      context: 'chapter-4'
    }
  ]
}

// Content optimization checklist
export const contentOptimizationChecklist = {
  perChapter: [
    '✓ H2 heading includes target keyword',
    '✓ First 100 words include primary keyword',
    '✓ Keyword density 1-2% (natural usage)',
    '✓ Internal link to related guide',
    '✓ At least one external authority link',
    '✓ Image with descriptive alt text',
    '✓ Actionable takeaways section',
    '✓ Examples or case studies included'
  ],
  perGuide: [
    '✓ Title includes primary keyword (front-loaded)',
    '✓ Meta description 150-160 characters',
    '✓ URL slug matches title keyword',
    '✓ Table of contents with anchor links',
    '✓ FAQ section at bottom',
    '✓ Related guides section',
    '✓ Author bio with expertise',
    '✓ Last updated date displayed',
    '✓ Social sharing buttons',
    '✓ Download PDF option',
    '✓ Email capture for follow-up content',
    '✓ Schema markup (Article, HowTo, FAQ)',
    '✓ Mobile-responsive design',
    '✓ Fast page load (<3 seconds)',
    '✓ Accessible (WCAG 2.1 AA)'
  ]
}

// Recommended internal anchor text for backlinking
export const anchorTextVariations: Record<GuideSlug, string[]> = {
  'cold-email-masterclass': [
    'cold email guide',
    'learn cold email',
    'cold email best practices',
    'complete cold email guide',
    'cold email masterclass',
    'how to do cold email',
    'cold email strategies'
  ],
  'deliverability-deep-dive': [
    'email deliverability guide',
    'improve email deliverability',
    'deliverability best practices',
    'email authentication setup',
    'inbox placement guide',
    'email deliverability tips'
  ],
  'agency-growth-playbook': [
    'agency growth guide',
    'scale your agency',
    'agency growth strategies',
    'agency client acquisition',
    'grow marketing agency',
    'agency playbook'
  ],
  'b2b-sales-automation': [
    'sales automation guide',
    'automate sales process',
    'sales automation tools',
    'b2b automation strategies',
    'sales automation best practices'
  ],
  'linkedin-outreach-guide': [
    'linkedin outreach guide',
    'linkedin prospecting tips',
    'master linkedin outreach',
    'linkedin sales strategies',
    'linkedin outreach best practices'
  ],
  'sales-copywriting-101': [
    'sales copywriting guide',
    'learn sales copywriting',
    'copywriting for sales',
    'email copywriting tips',
    'persuasive writing guide'
  ],
  'b2b-lead-generation': [
    'b2b lead gen guide',
    'lead generation strategies',
    'b2b lead generation tips',
    'multi-channel lead generation',
    'b2b marketing guide'
  ]
}

// Content refresh schedule
export const contentRefreshSchedule = {
  quarterly: [
    'Update statistics and data',
    'Add new tool recommendations',
    'Refresh examples with recent cases',
    'Check and fix broken links'
  ],
  annually: [
    'Major content overhaul',
    'Add new chapters if needed',
    'Update all screenshots',
    'Rewrite outdated sections',
    'Expand FAQ based on common questions'
  ]
}

// Export everything for easy import
export default {
  seoConfig,
  metaDescriptions,
  generateArticleSchema,
  generateHowToSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  ogImageConfig,
  internalLinks,
  contentOptimizationChecklist,
  anchorTextVariations,
  contentRefreshSchedule
}