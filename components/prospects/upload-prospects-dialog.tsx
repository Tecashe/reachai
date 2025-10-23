// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"

// export function UploadProspectsDialog() {
//   const [open, setOpen] = useState(false)
//   const [file, setFile] = useState<File | null>(null)
//   const [uploading, setUploading] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [uploadComplete, setUploadComplete] = useState(false)

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0])
//     }
//   }

//   const handleUpload = async () => {
//     if (!file) return

//     setUploading(true)
//     setUploadProgress(0)

//     // Simulate upload progress
//     const interval = setInterval(() => {
//       setUploadProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval)
//           setUploading(false)
//           setUploadComplete(true)
//           return 100
//         }
//         return prev + 10
//       })
//     }, 200)
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setFile(null)
//     setUploading(false)
//     setUploadProgress(0)
//     setUploadComplete(false)
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Upload className="h-4 w-4 mr-2" />
//           Upload CSV
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-xl">
//         <DialogHeader>
//           <DialogTitle>Upload Prospects</DialogTitle>
//           <DialogDescription>
//             Import prospects from a CSV file. Make sure your file includes email addresses.
//           </DialogDescription>
//         </DialogHeader>

//         {!uploadComplete ? (
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="campaign">Assign to Campaign (Optional)</Label>
//               <Select>
//                 <SelectTrigger id="campaign">
//                   <SelectValue placeholder="Select a campaign" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">No Campaign</SelectItem>
//                   <SelectItem value="1">Q1 Outreach - Tech Startups</SelectItem>
//                   <SelectItem value="2">SaaS Founders Follow-up</SelectItem>
//                   <SelectItem value="3">Enterprise Sales Campaign</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-4">
//               <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
//                 <input
//                   type="file"
//                   accept=".csv"
//                   onChange={handleFileChange}
//                   className="hidden"
//                   id="file-upload"
//                   disabled={uploading}
//                 />
//                 <label htmlFor="file-upload" className="cursor-pointer">
//                   <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                   {file ? (
//                     <div>
//                       <p className="text-sm font-medium">{file.name}</p>
//                       <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(2)} KB</p>
//                     </div>
//                   ) : (
//                     <div>
//                       <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
//                       <p className="text-xs text-muted-foreground">CSV file (max 10MB)</p>
//                     </div>
//                   )}
//                 </label>
//               </div>

//               {uploading && (
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Uploading...</span>
//                     <span className="font-medium">{uploadProgress}%</span>
//                   </div>
//                   <Progress value={uploadProgress} />
//                 </div>
//               )}
//             </div>

//             <div className="bg-muted/50 rounded-lg p-4 space-y-2">
//               <p className="text-sm font-medium">CSV Format Requirements:</p>
//               <ul className="text-xs text-muted-foreground space-y-1">
//                 <li>• Required: email</li>
//                 <li>• Optional: firstName, lastName, company, jobTitle, linkedinUrl, websiteUrl</li>
//                 <li>• First row should contain column headers</li>
//               </ul>
//             </div>

//             <div className="flex gap-3">
//               <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1">
//                 {uploading ? "Uploading..." : "Upload Prospects"}
//               </Button>
//               <Button variant="outline" onClick={handleClose} disabled={uploading}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="py-8 text-center space-y-4">
//             <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 dark:text-green-400" />
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Upload Successful!</h3>
//               <p className="text-sm text-muted-foreground">
//                 Successfully imported <span className="font-semibold text-foreground">127 prospects</span>
//               </p>
//             </div>
//             <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Valid emails:</span>
//                 <span className="font-medium text-green-600 dark:text-green-400">127</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Duplicates skipped:</span>
//                 <span className="font-medium">3</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Invalid emails:</span>
//                 <span className="font-medium text-destructive">2</span>
//               </div>
//             </div>
//             <Button onClick={handleClose} className="w-full">
//               Done
//             </Button>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }

// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { getCampaigns } from "@/lib/actions/campaigns"
// import { uploadProspects } from "@/lib/actions/prospects"
// import { useRouter } from "next/navigation"

// export function UploadProspectsDialog() {
//   const [open, setOpen] = useState(false)
//   const [file, setFile] = useState<File | null>(null)
//   const [uploading, setUploading] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [uploadComplete, setUploadComplete] = useState(false)
//   const [uploadResult, setUploadResult] = useState<{ count: number } | null>(null)
//   const [campaigns, setCampaigns] = useState<any[]>([])
//   const [selectedCampaign, setSelectedCampaign] = useState<string>("")
//   const router = useRouter()

//   useEffect(() => {
//     if (open) {
//       getCampaigns().then(setCampaigns)
//     }
//   }, [open])

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0])
//     }
//   }

//   const parseCSV = (text: string): any[] => {
//     const lines = text.split("\n").filter((line) => line.trim())
//     if (lines.length < 2) return []

//     const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
//     const prospects = []

//     for (let i = 1; i < lines.length; i++) {
//       const values = lines[i].split(",").map((v) => v.trim())
//       const prospect: any = {}

//       headers.forEach((header, index) => {
//         const value = values[index] || ""
//         if (header === "email") prospect.email = value
//         else if (header === "firstname" || header === "first_name") prospect.firstName = value
//         else if (header === "lastname" || header === "last_name") prospect.lastName = value
//         else if (header === "company") prospect.company = value
//         else if (header === "jobtitle" || header === "job_title") prospect.jobTitle = value
//         else if (header === "linkedinurl" || header === "linkedin_url" || header === "linkedin")
//           prospect.linkedinUrl = value
//         else if (header === "websiteurl" || header === "website_url" || header === "website")
//           prospect.companyWebsite = value
//       })

//       if (prospect.email) {
//         prospects.push(prospect)
//       }
//     }

//     return prospects
//   }

//   const handleUpload = async () => {
//     if (!file || !selectedCampaign) return

//     setUploading(true)
//     setUploadProgress(0)

//     try {
//       const text = await file.text()
//       const prospects = parseCSV(text)

//       setUploadProgress(50)

//       const result = await uploadProspects(selectedCampaign, prospects)

//       setUploadProgress(100)
//       setUploadResult(result)
//       setUploadComplete(true)
//       router.refresh()
//     } catch (error) {
//       console.error("Upload failed:", error)
//       alert("Upload failed. Please try again.")
//     } finally {
//       setUploading(false)
//     }
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setFile(null)
//     setUploading(false)
//     setUploadProgress(0)
//     setUploadComplete(false)
//     setUploadResult(null)
//     setSelectedCampaign("")
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Upload className="h-4 w-4 mr-2" />
//           Upload CSV
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-xl">
//         <DialogHeader>
//           <DialogTitle>Upload Prospects</DialogTitle>
//           <DialogDescription>
//             Import prospects from a CSV file. Make sure your file includes email addresses.
//           </DialogDescription>
//         </DialogHeader>

//         {!uploadComplete ? (
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="campaign">
//                 Assign to Campaign <span className="text-destructive">*</span>
//               </Label>
//               <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
//                 <SelectTrigger id="campaign">
//                   <SelectValue placeholder="Select a campaign" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {campaigns.map((campaign) => (
//                     <SelectItem key={campaign.id} value={campaign.id}>
//                       {campaign.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-4">
//               <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
//                 <input
//                   type="file"
//                   accept=".csv"
//                   onChange={handleFileChange}
//                   className="hidden"
//                   id="file-upload"
//                   disabled={uploading}
//                 />
//                 <label htmlFor="file-upload" className="cursor-pointer">
//                   <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                   {file ? (
//                     <div>
//                       <p className="text-sm font-medium">{file.name}</p>
//                       <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(2)} KB</p>
//                     </div>
//                   ) : (
//                     <div>
//                       <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
//                       <p className="text-xs text-muted-foreground">CSV file (max 10MB)</p>
//                     </div>
//                   )}
//                 </label>
//               </div>

//               {uploading && (
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Uploading...</span>
//                     <span className="font-medium">{uploadProgress}%</span>
//                   </div>
//                   <Progress value={uploadProgress} />
//                 </div>
//               )}
//             </div>

//             <div className="bg-muted/50 rounded-lg p-4 space-y-2">
//               <p className="text-sm font-medium">CSV Format Requirements:</p>
//               <ul className="text-xs text-muted-foreground space-y-1">
//                 <li>• Required: email</li>
//                 <li>• Optional: firstName, lastName, company, jobTitle, linkedinUrl, websiteUrl</li>
//                 <li>• First row should contain column headers</li>
//               </ul>
//             </div>

//             <div className="flex gap-3">
//               <Button onClick={handleUpload} disabled={!file || !selectedCampaign || uploading} className="flex-1">
//                 {uploading ? "Uploading..." : "Upload Prospects"}
//               </Button>
//               <Button variant="outline" onClick={handleClose} disabled={uploading}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="py-8 text-center space-y-4">
//             <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 dark:text-green-400" />
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Upload Successful!</h3>
//               <p className="text-sm text-muted-foreground">
//                 Successfully imported{" "}
//                 <span className="font-semibold text-foreground">{uploadResult?.count || 0} prospects</span>
//               </p>
//             </div>
//             <Button onClick={handleClose} className="w-full">
//               Done
//             </Button>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }
// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Upload, FileSpreadsheet, CheckCircle2, Download } from "lucide-react"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { getCampaigns } from "@/lib/actions/campaigns"
// import { useRouter } from "next/navigation"

// export function UploadProspectsDialog() {
//   const [open, setOpen] = useState(false)
//   const [file, setFile] = useState<File | null>(null)
//   const [uploading, setUploading] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [uploadComplete, setUploadComplete] = useState(false)
//   const [uploadResult, setUploadResult] = useState<{ count: number } | null>(null)
//   const [campaigns, setCampaigns] = useState<any[]>([])
//   const [selectedCampaign, setSelectedCampaign] = useState<string>("")
//   const router = useRouter()

//   useEffect(() => {
//     if (open) {
//       getCampaigns().then(setCampaigns)
//     }
//   }, [open])

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0])
//     }
//   }

//   const handleDownloadSample = () => {
//     const link = document.createElement("a")
//     link.href = "/sample-prospects.csv"
//     link.download = "sample-prospects.csv"
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const handleUpload = async () => {
//     if (!file || !selectedCampaign) return

//     setUploading(true)
//     setUploadProgress(0)

//     try {
//       const formData = new FormData()
//       formData.append("file", file)
//       formData.append("campaignId", selectedCampaign)

//       setUploadProgress(30)

//       const response = await fetch("/api/prospects/upload", {
//         method: "POST",
//         body: formData,
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.error || "Upload failed")
//       }

//       const result = await response.json()

//       setUploadProgress(100)
//       setUploadResult({ count: result.imported })
//       setUploadComplete(true)
//       router.refresh()
//     } catch (error) {
//       console.error("Upload failed:", error)
//       alert(error instanceof Error ? error.message : "Upload failed. Please try again.")
//     } finally {
//       setUploading(false)
//     }
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setFile(null)
//     setUploading(false)
//     setUploadProgress(0)
//     setUploadComplete(false)
//     setUploadResult(null)
//     setSelectedCampaign("")
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Upload className="h-4 w-4 mr-2" />
//           Upload CSV
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-xl">
//         <DialogHeader>
//           <DialogTitle>Upload Prospects</DialogTitle>
//           <DialogDescription>
//             Import prospects from a CSV file. Make sure your file includes email addresses.
//           </DialogDescription>
//         </DialogHeader>

//         {!uploadComplete ? (
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="campaign">
//                 Assign to Campaign <span className="text-destructive">*</span>
//               </Label>
//               <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
//                 <SelectTrigger id="campaign">
//                   <SelectValue placeholder="Select a campaign" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {campaigns.map((campaign) => (
//                     <SelectItem key={campaign.id} value={campaign.id}>
//                       {campaign.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-4">
//               <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
//                 <input
//                   type="file"
//                   accept=".csv"
//                   onChange={handleFileChange}
//                   className="hidden"
//                   id="file-upload"
//                   disabled={uploading}
//                 />
//                 <label htmlFor="file-upload" className="cursor-pointer">
//                   <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                   {file ? (
//                     <div>
//                       <p className="text-sm font-medium">{file.name}</p>
//                       <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(2)} KB</p>
//                     </div>
//                   ) : (
//                     <div>
//                       <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
//                       <p className="text-xs text-muted-foreground">CSV file (max 10MB)</p>
//                     </div>
//                   )}
//                 </label>
//               </div>

//               {uploading && (
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Uploading...</span>
//                     <span className="font-medium">{uploadProgress}%</span>
//                   </div>
//                   <Progress value={uploadProgress} />
//                 </div>
//               )}
//             </div>

//             <div className="bg-muted/50 rounded-lg p-4 space-y-3">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium">CSV Format Requirements:</p>
//                 <Button variant="ghost" size="sm" onClick={handleDownloadSample}>
//                   <Download className="h-3 w-3 mr-1" />
//                   Sample CSV
//                 </Button>
//               </div>
//               <ul className="text-xs text-muted-foreground space-y-1">
//                 <li>• Required: email</li>
//                 <li>• Optional: firstName, lastName, company, jobTitle, linkedinUrl, websiteUrl</li>
//                 <li>• First row should contain column headers</li>
//               </ul>
//             </div>

//             <div className="flex gap-3">
//               <Button onClick={handleUpload} disabled={!file || !selectedCampaign || uploading} className="flex-1">
//                 {uploading ? "Uploading..." : "Upload Prospects"}
//               </Button>
//               <Button variant="outline" onClick={handleClose} disabled={uploading}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="py-8 text-center space-y-4">
//             <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 dark:text-green-400" />
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Upload Successful!</h3>
//               <p className="text-sm text-muted-foreground">
//                 Successfully imported{" "}
//                 <span className="font-semibold text-foreground">{uploadResult?.count || 0} prospects</span>
//               </p>
//             </div>
//             <Button onClick={handleClose} className="w-full">
//               Done
//             </Button>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, FileSpreadsheet, CheckCircle2, Download } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { getCampaigns } from "@/lib/actions/campaigns"
import { useRouter } from "next/navigation"

export function UploadProspectsDialog() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ count: number } | null>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    if (open) {
      getCampaigns().then(setCampaigns)
    }
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDownloadSample = () => {
    const link = document.createElement("a")
    link.href = "/sample-prospects.csv"
    link.download = "sample-prospects.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleUpload = async () => {
    if (!file || !selectedCampaign) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("campaignId", selectedCampaign)

      setUploadProgress(30)

      const response = await fetch("/api/prospects/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const result = await response.json()

      setUploadProgress(100)
      setUploadResult({ count: result.uploaded || 0 })
      setUploadComplete(true)

      await fetch("/api/onboarding/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "hasAddedProspects" }),
      })

      router.refresh()
    } catch (error) {
      console.error("Upload failed:", error)
      alert(error instanceof Error ? error.message : "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setFile(null)
    setUploading(false)
    setUploadProgress(0)
    setUploadComplete(false)
    setUploadResult(null)
    setSelectedCampaign("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Upload CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Prospects</DialogTitle>
          <DialogDescription>
            Import prospects from a CSV file. Make sure your file includes email addresses.
          </DialogDescription>
        </DialogHeader>

        {!uploadComplete ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="campaign">
                Assign to Campaign <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger id="campaign">
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
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
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleUpload} disabled={!file || !selectedCampaign || uploading} className="flex-1">
                {uploading ? "Uploading..." : "Upload Prospects"}
              </Button>
              <Button variant="outline" onClick={handleClose} disabled={uploading}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Successfully imported{" "}
                <span className="font-semibold text-foreground">{uploadResult?.count || 0} prospects</span>
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
