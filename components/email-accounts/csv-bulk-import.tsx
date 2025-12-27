"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { WaveLoader } from "@/components/loader/wave-loader"
import { Upload, Download, ArrowLeft } from "lucide-react"

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
      <div className="flex items-center gap-3">
        <Button onClick={onCancel} variant="ghost" size="icon" className="shrink-0 h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Bulk Import</h3>
          <p className="text-sm text-muted-foreground">Import multiple accounts via CSV</p>
        </div>
      </div>

      <Card className="p-5 bg-card border-border/50">
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-foreground">CSV Template</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Download the template to see the required format
          </p>
          <Button onClick={downloadTemplate} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-3.5 w-3.5" />
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
            : "bg-card border-2 border-dashed border-border/50 hover:border-border"
        }`}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Drop your CSV file here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </div>

          <label>
            <input type="file" accept=".csv" onChange={handleFileInput} disabled={isLoading} className="hidden" />
            <Button asChild disabled={isLoading} size="sm" className="gap-2">
              <span>
                {isLoading ? (
                  <>
                    <WaveLoader size="sm" color="bg-primary-foreground" />
                    <span>Importing...</span>
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
