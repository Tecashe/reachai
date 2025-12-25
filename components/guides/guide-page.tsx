// components/guides/GuideContent.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  BookOpen, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  ChevronDown,
  Twitter,
  Linkedin,
  Printer
} from 'lucide-react'
import { Guide } from '@/lib/guides-data'
import ChapterNavigation from './chapter-navigation'
import RelatedGuides from './related-guides'
import ProgressBar from './progressBar'

interface Props {
  guide: Guide
  relatedGuides: Guide[]
  slug: string
}

export default function GuideContent({ guide, relatedGuides, slug }: Props) {
  const [completedChapters, setCompletedChapters] = useState<number[]>([])
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [activeChapter, setActiveChapter] = useState<number>(1)
  const contentRef = useRef<HTMLDivElement>(null)

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`guide-${slug}-progress`)
      if (saved) {
        setCompletedChapters(JSON.parse(saved))
      }
    } catch (e) {
      console.log('localStorage not available')
    }
  }, [slug])

  // Track active chapter on scroll
  useEffect(() => {
    const handleScroll = () => {
      const chapters = guide.tableOfContents
      for (let i = chapters.length - 1; i >= 0; i--) {
        const element = document.getElementById(`chapter-${chapters[i].id}`)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveChapter(chapters[i].id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [guide.tableOfContents])

  // Mark chapter as complete
  const markChapterComplete = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      const updated = [...completedChapters, chapterId]
      setCompletedChapters(updated)
      
      try {
        localStorage.setItem(`guide-${slug}-progress`, JSON.stringify(updated))
      } catch (e) {
        console.log('Could not save progress')
      }
    }
  }

  // Share functions
  const shareUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://yoursite.com/guides/${slug}`

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(guide.title)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    )
  }

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    )
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard!')
  }

  const handlePrint = () => {
    window.print()
  }

  const progressPercentage = (completedChapters.length / guide.tableOfContents.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Progress Bar */}
      <ProgressBar />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/guides"
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Guides</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Progress Indicator */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-neutral-600">
                {completedChapters.length} of {guide.tableOfContents.length} chapters
              </span>
              <div className="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <button 
              onClick={() => window.open(`/api/guides/download/${slug}`, '_blank')}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download className="w-5 h-5 text-neutral-600" />
            </button>
            
            <button 
              onClick={handlePrint}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors hidden sm:block"
              title="Print"
            >
              <Printer className="w-5 h-5 text-neutral-600" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5 text-neutral-600" />
              </button>

              {showShareMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowShareMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50">
                    <button
                      onClick={shareOnTwitter}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <Twitter className="w-4 h-4" />
                      <span>Share on Twitter</span>
                    </button>
                    <button
                      onClick={shareOnLinkedIn}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>Share on LinkedIn</span>
                    </button>
                    <button
                      onClick={copyLink}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Article Content */}
          <article ref={contentRef} className="max-w-3xl">
            {/* Hero Section */}
            <div className="mb-12">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
                <Link href="/" className="hover:text-neutral-900">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/guides" className="hover:text-neutral-900">Guides</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900">{guide.title}</span>
              </nav>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-6">
                <span className={`px-3 py-1 rounded-full font-medium ${
                  guide.difficulty === 'Beginner' 
                    ? 'bg-green-100 text-green-700'
                    : guide.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {guide.difficulty}
                </span>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{guide.chapters} Chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{guide.readTime} min read</span>
                </div>
                <time className="text-neutral-400">
                  Updated {new Date(guide.lastModified).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </time>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                {guide.h1}
              </h1>

              {/* Intro */}
              <p className="text-xl text-neutral-600 leading-relaxed mb-8">
                {guide.intro}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                <Image
                  src={guide.author.image}
                  alt={guide.author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <div className="font-semibold text-neutral-900">{guide.author.name}</div>
                  <div className="text-sm text-neutral-600">{guide.author.role}</div>
                  <p className="text-sm text-neutral-500 mt-1">{guide.author.bio}</p>
                </div>
              </div>
            </div>

            {/* Table of Contents - Mobile */}
            <div className="lg:hidden mb-12 bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="font-semibold text-neutral-900 mb-4">Table of Contents</h2>
              <div className="space-y-2">
                {guide.tableOfContents.map((chapter, idx) => (
                  <a
                    key={chapter.id}
                    href={`#chapter-${chapter.id}`}
                    className="flex items-center justify-between py-2 text-sm hover:text-blue-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        completedChapters.includes(chapter.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {completedChapters.includes(chapter.id) ? '✓' : idx + 1}
                      </span>
                      <span className={completedChapters.includes(chapter.id) ? 'line-through' : ''}>
                        {chapter.title}
                      </span>
                    </div>
                    <span className="text-neutral-400 text-xs">{chapter.duration}m</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Chapters */}
            <div className="space-y-12">
              {guide.tableOfContents.map((chapter) => (
                <section 
                  key={chapter.id}
                  id={`chapter-${chapter.id}`}
                  className="scroll-mt-24"
                >
                  {/* Chapter Header */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-neutral-200">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                      completedChapters.includes(chapter.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-neutral-900 text-white'
                    }`}>
                      {completedChapters.includes(chapter.id) ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        chapter.id
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-neutral-900">{chapter.title}</h2>
                      <div className="text-sm text-neutral-500 mt-1">{chapter.duration} min read</div>
                    </div>
                  </div>

                  {/* Chapter Content */}
                  <div 
                    className="prose prose-neutral max-w-none prose-headings:scroll-mt-24"
                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                  />

                  {/* Key Takeaways */}
                  {chapter.keyTakeaways && chapter.keyTakeaways.length > 0 && (
                    <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-blue-600" />
                        Key Takeaways
                      </h3>
                      <ul className="space-y-2">
                        {chapter.keyTakeaways.map((takeaway, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-neutral-700">{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Mistakes */}
                  {chapter.commonMistakes && chapter.commonMistakes.length > 0 && (
                    <div className="mt-6 bg-red-50 rounded-xl p-6 border border-red-100">
                      <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        Common Mistakes to Avoid
                      </h3>
                      <ul className="space-y-2">
                        {chapter.commonMistakes.map((mistake, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-red-600 font-bold">✕</span>
                            <span className="text-neutral-700">{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Pro Tips */}
                  {chapter.proTips && chapter.proTips.length > 0 && (
                    <div className="mt-6 bg-purple-50 rounded-xl p-6 border border-purple-100">
                      <h3 className="font-semibold text-neutral-900 mb-4">💡 Pro Tips</h3>
                      <ul className="space-y-2">
                        {chapter.proTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-purple-600">→</span>
                            <span className="text-neutral-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Examples */}
                  {chapter.examples && (
                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      {chapter.examples.bad && (
                        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                          <h5 className="font-semibold text-red-900 mb-3">❌ Bad Examples</h5>
                          <ul className="space-y-2">
                            {chapter.examples.bad.map((ex, idx) => (
                              <li key={idx} className="text-sm text-red-700">{ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {chapter.examples.good && (
                        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                          <h5 className="font-semibold text-green-900 mb-3">✅ Good Examples</h5>
                          <ul className="space-y-2">
                            {chapter.examples.good.map((ex, idx) => (
                              <li key={idx} className="text-sm text-green-700">{ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mark Complete Button */}
                  {!completedChapters.includes(chapter.id) && (
                    <button
                      onClick={() => markChapterComplete(chapter.id)}
                      className="mt-8 w-full py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
                    >
                      Mark Chapter as Complete
                    </button>
                  )}
                </section>
              ))}
            </div>

            {/* FAQ Section */}
            {guide.faq && guide.faq.length > 0 && (
              <section className="mt-20 pt-12 border-t border-neutral-200">
                <h2 className="text-3xl font-bold text-neutral-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {guide.faq.map((item, idx) => (
                    <details 
                      key={idx}
                      className="group bg-white rounded-xl border border-neutral-200 p-6"
                    >
                      <summary className="font-semibold text-neutral-900 cursor-pointer list-none flex items-center justify-between">
                        {item.question}
                        <ChevronDown className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="mt-4 text-neutral-600 leading-relaxed">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* CTA Section */}
            <div className="mt-20 p-8 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Put This Into Action?</h2>
              <p className="text-neutral-300 mb-6">
                Start implementing these strategies with our platform. Built specifically for the techniques covered in this guide.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-white text-neutral-900 rounded-xl font-medium hover:bg-neutral-100 transition-colors">
                  Start Free Trial
                </button>
                <button className="px-6 py-3 border border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Chapter Navigation */}
              <ChapterNavigation 
                chapters={guide.tableOfContents}
                completedChapters={completedChapters}
                activeChapter={activeChapter}
              />

              {/* Related Guides */}
              <RelatedGuides guides={relatedGuides} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}