"use client"

import { useEffect, useRef, useCallback, useState } from "react"

interface AutosaveOptions {
  onSave: () => Promise<{ success: boolean; version?: number; error?: string }>
  delay?: number
  onConflict?: () => void
  enabled?: boolean
}

type SaveStatus = "idle" | "saving" | "saved" | "error" | "offline"

export function useAutosave({ onSave, delay = 3000, onConflict, enabled = true }: AutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>("idle")
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastVersionRef = useRef<number | undefined>(undefined)
  const isSavingRef = useRef(false)
  const retryCountRef = useRef(0)
  const maxRetries = 5

  const triggerSave = useCallback(async () => {
    if (!enabled || isSavingRef.current) return

    isSavingRef.current = true
    setStatus("saving")
    setError(undefined)

    try {
      if (!navigator.onLine) {
        setStatus("offline")
        localStorage.setItem(
          "template-backup",
          JSON.stringify({
            timestamp: Date.now(),
            pending: true,
          }),
        )
        isSavingRef.current = false
        return
      }

      const result = await onSave()

      if (result.success) {
        if (
          lastVersionRef.current !== undefined &&
          result.version !== undefined &&
          result.version !== lastVersionRef.current + 1
        ) {
          setStatus("error")
          setError("Conflict detected")
          onConflict?.()
        } else {
          lastVersionRef.current = result.version
          setStatus("saved")
          setLastSaved(new Date())
          localStorage.removeItem("template-backup")
          retryCountRef.current = 0
        }
      } else {
        retryCountRef.current++
        setStatus("error")
        setError(result.error || "Save failed")

        console.log("[v0] Save failed, retry count:", retryCountRef.current)

        // If we haven't exceeded max retries, schedule another attempt with exponential backoff
        if (retryCountRef.current < maxRetries) {
          const backoffDelay = Math.min(delay * Math.pow(2, retryCountRef.current), 30000) // Max 30 seconds
          console.log("[v0] Scheduling retry in", backoffDelay, "ms")

          setTimeout(() => {
            if (enabled) {
              triggerSave()
            }
          }, backoffDelay)
        } else {
          console.log("[v0] Max retries exceeded, giving up")
          setError("Failed to save after multiple attempts. Please check your connection.")
        }
      }
    } catch (err) {
      console.error("[v0] Autosave error:", err)
      retryCountRef.current++
      setStatus("error")
      setError("Failed to save changes")

      // Retry logic for exceptions too
      if (retryCountRef.current < maxRetries) {
        const backoffDelay = Math.min(delay * Math.pow(2, retryCountRef.current), 30000)
        setTimeout(() => {
          if (enabled) {
            triggerSave()
          }
        }, backoffDelay)
      }
    } finally {
      isSavingRef.current = false
    }
  }, [enabled, onSave, onConflict, delay])

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      triggerSave()
    }, delay)
  }, [delay, triggerSave])

  const saveNow = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    triggerSave()
  }, [triggerSave])

  useEffect(() => {
    const handleOnline = () => {
      const backup = localStorage.getItem("template-backup")
      if (backup) {
        const data = JSON.parse(backup)
        if (data.pending) {
          triggerSave()
        }
      }
    }

    const handleOffline = () => {
      setStatus("offline")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [triggerSave])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    status,
    lastSaved,
    error,
    scheduleSave,
    saveNow,
    setInitialVersion: (version: number) => {
      lastVersionRef.current = version
    },
  }
}
