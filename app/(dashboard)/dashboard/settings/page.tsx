import { redirect } from "next/navigation"

export default function SettingsPage() {
  // Redirect to the first settings page (Profile)
  redirect("/dashboard/settings/profile")
}
