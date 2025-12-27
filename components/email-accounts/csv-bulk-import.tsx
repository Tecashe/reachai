"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, Download, Loader2, ArrowLeft } from "lucide-react"

interface Props {
  onAccountsAdded: () => void
  onCancel: () => void
}

export function CsvBulkImport({ onAccountsAdded, onCancel }: Props) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file",
        description: "Please upload a CSV file",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/settings/sending-accounts/bulk-import", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to import accounts")

      const data = await response.json()
      toast({
        title: "Success",
        description: `${data.imported} accounts imported successfully`,
      })
      onAccountsAdded()
    } catch (error) {
      console.error("[v0] CSV import error:", error)
      toast({
        title: "Error",
        description: "Failed to import accounts from CSV",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      "Account Name,Email,Provider,SMTP Host,SMTP Port,SMTP Username,SMTP Password,IMAP Host,IMAP Port,IMAP Username,IMAP Password",
      "My Gmail,user@gmail.com,gmail,smtp.gmail.com,587,user@gmail.com,app-password,imap.gmail.com,993,user@gmail.com,app-password",
      "My Outlook,user@outlook.com,outlook,smtp.office365.com,587,user@outlook.com,password,outlook.office365.com,993,user@outlook.com,password",
    ]
    const blob = new Blob([template.join("\n")], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "email-accounts-template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onCancel} variant="ghost" size="icon" className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Bulk Import Accounts</h3>
          <p className="text-muted-foreground mt-1">Import multiple email accounts at once using a CSV file</p>
        </div>
      </div>

      <Card className="p-6 bg-white">
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">CSV Template</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Download the template to see the required format for bulk importing
          </p>
          <Button onClick={downloadTemplate} variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </Card>

      <Card
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-8 transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "bg-primary/5 border-primary border-2 border-dashed"
            : "bg-white border-2 border-dashed hover:border-foreground/40"
        }`}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">Drop your CSV file here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>

          <label>
            <input type="file" accept=".csv" onChange={handleFileInput} disabled={isLoading} className="hidden" />
            <Button asChild disabled={isLoading} className="gap-2 bg-primary hover:bg-primary/90">
              <span>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>Select CSV File</>
                )}
              </span>
            </Button>
          </label>
        </div>
      </Card>
    </div>
  )
}
