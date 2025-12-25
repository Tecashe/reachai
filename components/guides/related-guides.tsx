// components/guides/RelatedGuides.tsx
// Shows related guides in sidebar

import Link from 'next/link'
import { Guide } from '@/lib/guides-data'
import { BookOpen, Clock, ArrowRight } from 'lucide-react'

interface Props {
  guides: Guide[]
}

export default function RelatedGuides({ guides }: Props) {
  if (guides.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <h3 className="font-semibold text-neutral-900 mb-4">Related Guides</h3>
      <div className="space-y-4">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="block group"
          >
            <div className="p-4 rounded-lg border border-neutral-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
              {/* Badge */}
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                guide.difficulty === 'Beginner' 
                  ? 'bg-green-100 text-green-700'
                  : guide.difficulty === 'Intermediate'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {guide.difficulty}
              </span>
              
              {/* Title */}
              <div className="text-sm font-medium text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                {guide.title}
              </div>
              
              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{guide.chapters} chapters</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{guide.readTime} min</span>
                </div>
              </div>
              
              {/* Read link */}
              <div className="flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:gap-2 transition-all">
                <span>Read guide</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}