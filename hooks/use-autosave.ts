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

  const triggerSave = useCallback(async () => {
    if (!enabled || isSavingRef.current) return

    isSavingRef.current = true
    setStatus("saving")
    setError(undefined)

    try {
      if (!navigator.onLine) {
        setStatus("offline")
        // Save to localStorage as backup
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
        }
      } else {
        setStatus("error")
        setError(result.error || "Save failed")
      }
    } catch (err) {
      console.error("[v0] Autosave error:", err)
      setStatus("error")
      setError("Failed to save changes")
    } finally {
      isSavingRef.current = false
    }
  }, [enabled, onSave, onConflict])

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
