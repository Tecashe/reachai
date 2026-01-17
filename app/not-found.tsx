"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const [typedLines, setTypedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState("")
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDrafts, setShowDrafts] = useState(false)
  const cursorRef = useRef<HTMLSpanElement>(null)

  const draftAttempts = [
    "Dear User, The page you're looking for...",
    "Hi there! We couldn't find the...",
    "404 - This page has gone missing and...",
    "Oops! Looks like you took a wrong turn...",
    "Error: Page not found. Please try...",
    "We searched everywhere but couldn't...",
  ]

  useEffect(() => {
    const timeout = setTimeout(() => setShowDrafts(true), 500)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!showDrafts || lineIndex >= draftAttempts.length) return

    const currentDraft = draftAttempts[lineIndex]

    if (!isDeleting) {
      if (charIndex < currentDraft.length) {
        const timeout = setTimeout(
          () => {
            setCurrentLine(currentDraft.slice(0, charIndex + 1))
            setCharIndex(charIndex + 1)
          },
          30 + Math.random() * 30,
        )
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 800)
        return () => clearTimeout(timeout)
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setCurrentLine(currentDraft.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        }, 15)
        return () => clearTimeout(timeout)
      } else {
        setTypedLines((prev) => [...prev, draftAttempts[lineIndex]])
        setIsDeleting(false)
        setLineIndex(lineIndex + 1)
      }
    }
  }, [showDrafts, lineIndex, charIndex, isDeleting])

  const isComplete = lineIndex >= draftAttempts.length

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center">
      {/* Paper texture lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 27px,
            currentColor 28px
          )`,
        }}
      />

      {/* Main content - Email compose style */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Compose header */}
          <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">New Message</span>
              <span className="text-xs text-muted-foreground font-mono">(Draft)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            </div>
          </div>

          {/* Compose fields */}
          <div className="border-b border-border">
            <div className="px-4 py-2 flex items-center border-b border-border/50">
              <span className="text-sm text-muted-foreground w-16">To:</span>
              <span className="text-sm text-foreground">you@example.com</span>
            </div>
            <div className="px-4 py-2 flex items-center">
              <span className="text-sm text-muted-foreground w-16">Subject:</span>
              <span className="text-sm text-foreground">Re: Page Not Found (Error 404)</span>
            </div>
          </div>

          {/* Compose body with typing animation */}
          <div className="p-4 min-h-[300px]">
            {/* Previously typed and deleted drafts (crossed out) */}
            {typedLines.map((line, i) => (
              <p key={i} className="text-muted-foreground/40 line-through text-sm mb-2 font-mono">
                {line}
              </p>
            ))}

            {/* Current typing line */}
            {!isComplete && (
              <p className="text-foreground text-sm font-mono">
                {currentLine}
                <span ref={cursorRef} className="inline-block w-0.5 h-4 bg-foreground ml-0.5 animate-pulse" />
              </p>
            )}

            {/* Final message when complete */}
            {isComplete && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-foreground font-medium mb-2">Draft could not be completed.</p>
                <p className="text-muted-foreground text-sm">
                  We've tried writing this 404 error message {draftAttempts.length} times, but nothing seems quite
                  right. Maybe the page you're looking for was never written in the first place.
                </p>
              </div>
            )}
          </div>

          {/* Compose footer */}
          <div className="bg-muted/30 border-t border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button size="sm" disabled className="opacity-50">
                Send
              </Button>
              <span className="text-xs text-muted-foreground font-mono">Draft saved {typedLines.length + 1}x</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5h-3.5A.5.5 0 0 1 9 4.5V1H4z" />
              </svg>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 404 indicator */}
        <div className="mt-6 text-center">
          <span className="font-mono text-6xl font-bold text-foreground/10">404</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button asChild size="lg">
            <Link href="/dashboard">Discard & Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
