import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailGeneratorForm } from "@/components/generate/email-generator-form"

export default function GenerateEmailPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Email Generator</h1>
        <p className="text-muted-foreground">Generate personalized cold emails powered by AI</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Email</CardTitle>
          <CardDescription>
            Select a prospect and let AI create a hyper-personalized email based on research insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailGeneratorForm />
        </CardContent>
      </Card>
    </div>
  )
}
