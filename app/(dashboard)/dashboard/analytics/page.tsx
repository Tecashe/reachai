import { redirect } from "next/navigation"

export default function AnalyticsPage() {
  // Redirect to the first analytics page (Overview)
  redirect("/dashboard/analytics/overview")
}
