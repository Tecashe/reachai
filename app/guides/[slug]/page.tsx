// // app/guides/[slug]/page.tsx
// // This is your dynamic guide page that generates routes for each guide

// import { Metadata } from 'next'
// import { notFound } from 'next/navigation'
// import { getGuide, getAllGuides, getRelatedGuides } from '@/lib/guides-data'
// import { 
//   generateArticleSchema, 
//   generateHowToSchema,
//   generateFAQSchema,
//   generateBreadcrumbSchema,
//   metaDescriptions 
// } from '@/lib/seo-config'
// import GuideContent from '@/components/guides/guide-page'

// interface Props {
//   params: { slug: string }
// }

// // Generate metadata for SEO
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const guide = getGuide(params.slug)
  
//   if (!guide) {
//     return { title: 'Guide Not Found' }
//   }

//   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'
//   const canonicalUrl = `${baseUrl}/guides/${params.slug}`
//   const ogImageUrl = `${baseUrl}/images/guides/${params.slug}-og.jpg`

//   return {
//     title: guide.seoTitle,
//     description: metaDescriptions[params.slug] || guide.description,
    
//     openGraph: {
//       title: guide.seoTitle,
//       description: guide.description,
//       type: 'article',
//       publishedTime: guide.publishDate,
//       modifiedTime: guide.lastModified,
//       authors: [guide.author.name],
//       url: canonicalUrl,
//       images: [
//         {
//           url: ogImageUrl,
//           width: 1200,
//           height: 630,
//           alt: guide.title,
//         },
//       ],
//     },
    
//     twitter: {
//       card: 'summary_large_image',
//       title: guide.seoTitle,
//       description: guide.description,
//       images: [ogImageUrl],
//     },
    
//     alternates: {
//       canonical: canonicalUrl,
//     },
    
//     keywords: [
//       'cold email',
//       'b2b outreach',
//       'email deliverability',
//       'sales automation',
//       'lead generation',
//       params.slug.replace(/-/g, ' ')
//     ],
    
//     robots: {
//       index: true,
//       follow: true,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//       'max-video-preview': -1,
//     },
//   }
// }

// // Generate the page
// export default function GuidePage({ params }: Props) {
//   const guide = getGuide(params.slug)
  
//   if (!guide) {
//     notFound()
//   }

//   const relatedGuides = getRelatedGuides(params.slug)

//   // Generate schema markups
//   const articleSchema = generateArticleSchema(guide, params.slug)
//   const howToSchema = generateHowToSchema(guide, params.slug)
//   const faqSchema = generateFAQSchema(guide.faq)
//   const breadcrumbSchema = generateBreadcrumbSchema(params.slug, guide.title)

//   return (
//     <>
//       {/* Schema.org structured data */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
//       />

//       {/* Main content */}
//       <GuideContent 
//         guide={guide} 
//         relatedGuides={relatedGuides} 
//         slug={params.slug}
//       />
//     </>
//   )
// }

// // Generate static paths at build time
// export function generateStaticParams() {
//   return getAllGuides().map(guide => ({
//     slug: guide.slug
//   }))
// }


// app/guides/[slug]/page.tsx
// This is your dynamic guide page that generates routes for each guide

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGuide, getAllGuides, getRelatedGuides, Guide } from '@/lib/guides-data'
import { 
  generateArticleSchema, 
  generateHowToSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  metaDescriptions,
  GuideSlug
} from '@/lib/seo-config'
import GuideContent from '@/components/guides/guide-page'

interface Props {
  params: { slug: string }
}

// Type guard to check if slug is a valid GuideSlug
function isValidGuideSlug(slug: string): slug is GuideSlug {
  const validSlugs: GuideSlug[] = [
    'cold-email-masterclass',
    'deliverability-deep-dive',
    'agency-growth-playbook',
    'b2b-sales-automation',
    'linkedin-outreach-guide',
    'sales-copywriting-101',
    'b2b-lead-generation'
  ]
  return validSlugs.includes(slug as GuideSlug)
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide(params.slug)
  
  if (!guide) {
    return { title: 'Guide Not Found' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'
  const canonicalUrl = `${baseUrl}/guides/${params.slug}`
  const ogImageUrl = `${baseUrl}/images/guides/${params.slug}-og.jpg`

  // Get meta description with type safety
  const metaDesc = isValidGuideSlug(params.slug) 
    ? metaDescriptions[params.slug] 
    : guide.description

  return {
    title: guide.seoTitle,
    description: metaDesc,
    
    openGraph: {
      title: guide.seoTitle,
      description: guide.description,
      type: 'article',
      publishedTime: guide.publishDate,
      modifiedTime: guide.lastModified,
      authors: [guide.author.name],
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: guide.seoTitle,
      description: guide.description,
      images: [ogImageUrl],
    },
    
    alternates: {
      canonical: canonicalUrl,
    },
    
    keywords: [
      'cold email',
      'b2b outreach',
      'email deliverability',
      'sales automation',
      'lead generation',
      params.slug.replace(/-/g, ' ')
    ],
    
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  }
}

// Convert Guide to GuideData format for schema generation
function convertGuideToSchemaData(guide: Guide) {
  return {
    title: guide.title,
    description: guide.description,
    publishDate: guide.publishDate,
    lastModified: guide.lastModified,
    readTime: guide.readTime,
    chapters: guide.tableOfContents.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      intro: chapter.content.substring(0, 200) // Extract first 200 chars as intro
    })),
    author: {
      name: guide.author.name,
      role: guide.author.role,
      slug: guide.author.name.toLowerCase().replace(/\s+/g, '-')
    },
    wordCount: guide.tableOfContents.reduce((total, chapter) => 
      total + chapter.content.split(' ').length, 0
    )
  }
}

// Generate the page
export default function GuidePage({ params }: Props) {
  const guide = getGuide(params.slug)
  
  if (!guide) {
    notFound()
  }

  const relatedGuides = getRelatedGuides(params.slug)

  // Validate slug and convert guide data for schemas
  if (!isValidGuideSlug(params.slug)) {
    // This shouldn't happen with generateStaticParams, but handle it gracefully
    notFound()
  }

  const guideData = convertGuideToSchemaData(guide)

  // Generate schema markups with proper typing
  const articleSchema = generateArticleSchema(guideData, params.slug)
  const howToSchema = generateHowToSchema(guideData, params.slug)
  const faqSchema = generateFAQSchema(guide.faq)
  const breadcrumbSchema = generateBreadcrumbSchema(params.slug, guide.title)

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Main content */}
      <GuideContent 
        guide={guide} 
        relatedGuides={relatedGuides} 
        slug={params.slug}
      />
    </>
  )
}

// Generate static paths at build time
export function generateStaticParams() {
  return getAllGuides().map(guide => ({
    slug: guide.slug
  }))
}