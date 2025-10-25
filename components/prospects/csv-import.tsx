"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, CheckCircle2, Download, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CSVImportProps {
  campaignId: string
  onImportComplete: (count: number) => void
}

export function CSVImport({ campaignId, onImportComplete }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ count: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setUploadComplete(false)
    }
  }

  const handleDownloadSample = () => {
    // Create sample CSV content
    const sampleCSV = `email,firstName,lastName,company,jobTitle,linkedinUrl,websiteUrl
john.doe@example.com,John,Doe,Acme Corp,CEO,https://linkedin.com/in/johndoe,https://acmecorp.com
jane.smith@example.com,Jane,Smith,Tech Inc,CTO,https://linkedin.com/in/janesmith,https://techinc.com`

    const blob = new Blob([sampleCSV], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "sample-prospects.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("campaignId", campaignId)

      setUploadProgress(30)

      const response = await fetch("/api/prospects/upload", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(70)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const result = await response.json()

      setUploadProgress(100)
      setUploadResult({ count: result.uploaded || 0 })
      setUploadComplete(true)

      // Notify parent component
      onImportComplete(result.uploaded || 0)
    } catch (error) {
      console.error("Upload failed:", error)
      setError(error instanceof Error ? error.message : "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setUploadComplete(false)
    setUploadResult(null)
    setUploadProgress(0)
    setError(null)
  }

  if (uploadComplete && uploadResult) {
    return (
      <div className="py-8 text-center space-y-4 border rounded-lg">
        <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 dark:text-green-400" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Successful!</h3>
          <p className="text-sm text-muted-foreground">
            Successfully imported <span className="font-semibold text-foreground">{uploadResult.count} prospects</span>
          </p>
        </div>
        <Button onClick={handleReset} variant="outline">
          Upload More Prospects
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-file-upload"
            disabled={uploading}
          />
          <label htmlFor="csv-file-upload" className="cursor-pointer">
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {file ? (
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">CSV file (max 10MB)</p>
              </div>
            )}
          </label>
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="font-medium">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">CSV Format Requirements:</p>
          <Button variant="ghost" size="sm" onClick={handleDownloadSample}>
            <Download className="h-3 w-3 mr-1" />
            Sample CSV
          </Button>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Required: email</li>
          <li>• Optional: firstName, lastName, company, jobTitle, linkedinUrl, websiteUrl</li>
          <li>• First row should contain column headers</li>
          <li>• Maximum 1,000 prospects per upload</li>
        </ul>
      </div>

      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : "Upload Prospects"}
      </Button>
    </div>
  )
}
