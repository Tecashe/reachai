"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function SampleCSVDownload() {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = "/sample-prospects.csv"
    link.download = "sample-prospects.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      <Download className="h-4 w-4 mr-2" />
      Download Sample CSV
    </Button>
  )
}
