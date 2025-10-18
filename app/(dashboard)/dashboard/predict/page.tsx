import { EmailPerformancePredictor } from "@/components/email-predictor/email-performance-predictor"

export default function PredictPage() {
  return (
    <div className="space-y-6"> 
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Performance Predictor</h1>
        <p className="text-muted-foreground">Predict your email's success before sending with AI-powered analysis</p>
      </div>

      <EmailPerformancePredictor />
    </div>
  )
}
