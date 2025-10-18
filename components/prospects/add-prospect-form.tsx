// "use client"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"

// export function AddProspectForm() {
//   return (
//     <form className="space-y-6">
//       <div className="grid gap-4 md:grid-cols-2">
//         <div className="space-y-2">
//           <Label htmlFor="firstName">First Name</Label>
//           <Input id="firstName" placeholder="John" />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="lastName">Last Name</Label>
//           <Input id="lastName" placeholder="Doe" />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="email">
//           Email <span className="text-destructive">*</span>
//         </Label>
//         <Input id="email" type="email" placeholder="john@example.com" required />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="company">Company</Label>
//         <Input id="company" placeholder="Acme Inc." />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="jobTitle">Job Title</Label>
//         <Input id="jobTitle" placeholder="Head of Sales" />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
//         <Input id="linkedinUrl" type="url" placeholder="https://linkedin.com/in/johndoe" />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="websiteUrl">Website URL</Label>
//         <Input id="websiteUrl" type="url" placeholder="https://example.com" />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="campaign">Assign to Campaign (Optional)</Label>
//         <Select>
//           <SelectTrigger id="campaign">
//             <SelectValue placeholder="Select a campaign" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="none">No Campaign</SelectItem>
//             <SelectItem value="1">Q1 Outreach - Tech Startups</SelectItem>
//             <SelectItem value="2">SaaS Founders Follow-up</SelectItem>
//             <SelectItem value="3">Enterprise Sales Campaign</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="notes">Notes (Optional)</Label>
//         <Textarea id="notes" placeholder="Any additional information about this prospect..." rows={3} />
//       </div>

//       <div className="flex gap-4 pt-4">
//         <Button type="submit" className="flex-1">
//           Add Prospect
//         </Button>
//         <Button type="button" variant="outline">
//           Cancel
//         </Button>
//       </div>
//     </form>
//   )
// }


// "use client"

// import type React from "react"

// import { useState, useEffect, useTransition } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { getCampaigns } from "@/lib/actions/campaigns"
// import { createProspect } from "@/lib/actions/prospects"
// import { useRouter } from "next/navigation"

// export function AddProspectForm() {
//   const [campaigns, setCampaigns] = useState<any[]>([])
//   const [selectedCampaign, setSelectedCampaign] = useState<string>("")
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()

//   useEffect(() => {
//     getCampaigns().then(setCampaigns)
//   }, [])

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)
//     formData.set("campaignId", selectedCampaign)

//     startTransition(async () => {
//       await createProspect(formData)
//       router.push("/dashboard/prospects")
//     })
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid gap-4 md:grid-cols-2">
//         <div className="space-y-2">
//           <Label htmlFor="firstName">First Name</Label>
//           <Input id="firstName" name="firstName" placeholder="John" />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="lastName">Last Name</Label>
//           <Input id="lastName" name="lastName" placeholder="Doe" />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="email">
//           Email <span className="text-destructive">*</span>
//         </Label>
//         <Input id="email" name="email" type="email" placeholder="john@example.com" required />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="company">Company</Label>
//         <Input id="company" name="company" placeholder="Acme Inc." />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="jobTitle">Job Title</Label>
//         <Input id="jobTitle" name="jobTitle" placeholder="Head of Sales" />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
//         <Input id="linkedinUrl" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/johndoe" />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="companyWebsite">Website URL</Label>
//         <Input id="companyWebsite" name="companyWebsite" type="url" placeholder="https://example.com" />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="campaign">
//           Assign to Campaign <span className="text-destructive">*</span>
//         </Label>
//         <Select value={selectedCampaign} onValueChange={setSelectedCampaign} required>
//           <SelectTrigger id="campaign">
//             <SelectValue placeholder="Select a campaign" />
//           </SelectTrigger>
//           <SelectContent>
//             {campaigns.map((campaign) => (
//               <SelectItem key={campaign.id} value={campaign.id}>
//                 {campaign.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex gap-4 pt-4">
//         <Button type="submit" className="flex-1" disabled={isPending || !selectedCampaign}>
//           {isPending ? "Adding..." : "Add Prospect"}
//         </Button>
//         <Button type="button" variant="outline" onClick={() => router.back()}>
//           Cancel
//         </Button>
//       </div>
//     </form>
//   )
// }

// "use client"

// import type React from "react"

// import { useState, useEffect, useTransition } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { getCampaigns } from "@/lib/actions/campaigns"
// import { createProspect } from "@/lib/actions/prospects"
// import { useRouter } from "next/navigation"

// export function AddProspectForm() {
//   const [campaigns, setCampaigns] = useState<any[]>([])
//   const [selectedCampaign, setSelectedCampaign] = useState<string>("")
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()

//   useEffect(() => {
//     getCampaigns().then(setCampaigns)
//   }, [])

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)
//     formData.set("campaignId", selectedCampaign)

//     startTransition(async () => {
//       await createProspect(formData)
//       router.push("/dashboard/prospects")
//     })
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid gap-4 md:grid-cols-2">
//         <div className="space-y-2">
//           <Label htmlFor="firstName">First Name</Label>
//           <Input id="firstName" name="firstName" placeholder="John" />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="lastName">Last Name</Label>
//           <Input id="lastName" name="lastName" placeholder="Doe" />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="email">
//           Email <span className="text-destructive">*</span>
//         </Label>
//         <Input id="email" name="email" type="email" placeholder="john@example.com" required />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="company">Company</Label>
//         <Input id="company" name="company" placeholder="Acme Inc." />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="jobTitle">Job Title</Label>
//         <Input id="jobTitle" name="jobTitle" placeholder="Head of Sales" />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
//         <Input id="linkedinUrl" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/johndoe" />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="websiteUrl">Website URL</Label>
//         <Input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://example.com" />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="campaign">
//           Assign to Campaign <span className="text-destructive">*</span>
//         </Label>
//         <Select value={selectedCampaign} onValueChange={setSelectedCampaign} required>
//           <SelectTrigger id="campaign">
//             <SelectValue placeholder="Select a campaign" />
//           </SelectTrigger>
//           <SelectContent>
//             {campaigns.map((campaign) => (
//               <SelectItem key={campaign.id} value={campaign.id}>
//                 {campaign.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex gap-4 pt-4">
//         <Button type="submit" className="flex-1" disabled={isPending || !selectedCampaign}>
//           {isPending ? "Adding..." : "Add Prospect"}
//         </Button>
//         <Button type="button" variant="outline" onClick={() => router.back()}>
//           Cancel
//         </Button>
//       </div>
//     </form>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCampaigns } from "@/lib/actions/campaigns"
import { createProspect } from "@/lib/actions/prospects"
import { useRouter } from "next/navigation"

export function AddProspectForm() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    getCampaigns().then(setCampaigns)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("campaignId", selectedCampaign)

    startTransition(async () => {
      const result = await createProspect(formData)
      if (result.success) {
        router.push(`/dashboard/prospects/${result.prospectId}`)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" placeholder="John" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" placeholder="Doe" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input id="email" name="email" type="email" placeholder="john@example.com" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" placeholder="Acme Inc." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input id="jobTitle" name="jobTitle" placeholder="Head of Sales" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
        <Input id="linkedinUrl" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/johndoe" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL</Label>
        <Input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="campaign">
          Assign to Campaign <span className="text-destructive">*</span>
        </Label>
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign} required>
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

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1" disabled={isPending || !selectedCampaign}>
          {isPending ? "Adding..." : "Add Prospect"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
