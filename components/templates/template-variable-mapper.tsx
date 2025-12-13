"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import {
  extractTemplateVariables,
  replaceTemplateVariables,
  type TemplateVariable,
} from "@/lib/utils/template-variables"

interface TemplateVariableMapperProps {
  subject: string
  body: string
  prospectData?: Record<string, string>
  onApply: (subject: string, body: string) => void
  onCancel: () => void
}

export function TemplateVariableMapper({
  subject,
  body,
  prospectData = {},
  onApply,
  onCancel,
}: TemplateVariableMapperProps) {
  const subjectVars = extractTemplateVariables(subject)
  const bodyVars = extractTemplateVariables(body)
  const allVars = Array.from(new Set([...subjectVars, ...bodyVars]))

  const [variables, setVariables] = useState<TemplateVariable[]>(
    allVars.map((name) => ({
      name,
      value: prospectData[name] || "",
    })),
  )

  function updateVariable(name: string, value: string) {
    setVariables((prev) => prev.map((v) => (v.name === name ? { ...v, value } : v)))
  }

  function handleApply() {
    const filledSubject = replaceTemplateVariables(subject, variables)
    const filledBody = replaceTemplateVariables(body, variables)
    onApply(filledSubject, filledBody)
  }

  const hasEmptyVariables = variables.some((v) => !v.value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fill Template Variables</CardTitle>
        <CardDescription>Provide values for the template variables to personalize your email</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allVars.length === 0 ? (
          <p className="text-sm text-muted-foreground">No variables found in this template</p>
        ) : (
          <>
            {variables.map((variable) => (
              <div key={variable.name} className="space-y-2">
                <Label htmlFor={variable.name}>
                  <Badge variant="outline" className="mr-2 font-mono">
                    {`{{${variable.name}}}`}
                  </Badge>
                  {variable.name}
                </Label>
                <Input
                  id={variable.name}
                  value={variable.value}
                  onChange={(e) => updateVariable(variable.name, e.target.value)}
                  placeholder={`Enter ${variable.name}`}
                />
              </div>
            ))}
            {hasEmptyVariables && (
              <div className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm dark:border-orange-900 dark:bg-orange-950">
                <AlertCircle className="mt-0.5 h-4 w-4 text-orange-600 dark:text-orange-400" />
                <p className="text-orange-900 dark:text-orange-200">
                  Some variables are empty. They will appear as placeholders in your email.
                </p>
              </div>
            )}
          </>
        )}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Template</Button>
        </div>
      </CardContent>
    </Card>
  )
}
