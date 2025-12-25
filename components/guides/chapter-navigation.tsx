// components/guides/ChapterNavigation.tsx
// Sticky sidebar navigation for chapters

'use client'

import { Chapter } from '@/lib/guides-data'
import { CheckCircle2, Circle } from 'lucide-react'

interface Props {
  chapters: Chapter[]
  completedChapters: number[]
  activeChapter?: number
}

export default function ChapterNavigation({ chapters, completedChapters, activeChapter }: Props) {
  return (
    <nav className="bg-white rounded-xl border border-neutral-200 p-6">
      <h3 className="font-semibold text-neutral-900 mb-4">Table of Contents</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {chapters.map((chapter, idx) => {
          const isCompleted = completedChapters.includes(chapter.id)
          const isActive = activeChapter === chapter.id
          
          return (
            <a
              key={chapter.id}
              href={`#chapter-${chapter.id}`}
              className={`flex items-center justify-between py-2 px-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className={`text-sm truncate ${isCompleted ? 'line-through opacity-60' : ''}`}>
                  {chapter.title}
                </span>
              </div>
              <span className="text-xs text-neutral-400 ml-2 flex-shrink-0">
                {chapter.duration}m
              </span>
            </a>
          )
        })}
      </div>
      
      {/* Progress */}
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
          <span>Progress</span>
          <span className="font-medium">
            {completedChapters.length} / {chapters.length}
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(completedChapters.length / chapters.length) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  )
}