// Utility functions for template variable replacement

export interface TemplateVariable {
  name: string
  value: string
}

export function replaceTemplateVariables(text: string, variables: TemplateVariable[]): string {
  let result = text

  variables.forEach((variable) => {
    const regex = new RegExp(`{{\\s*${variable.name}\\s*}}`, "g")
    result = result.replace(regex, variable.value)
  })

  return result
}

export function extractTemplateVariables(text: string): string[] {
  const regex = /{{(\s*\w+\s*)}}/g
  const matches = text.matchAll(regex)
  const variables = new Set<string>()

  for (const match of matches) {
    const varName = match[1].trim()
    variables.add(varName)
  }

  return Array.from(variables)
}

export function validateTemplateVariables(
  text: string,
  requiredVariables: string[],
): { valid: boolean; missing: string[] } {
  const textVariables = extractTemplateVariables(text)
  const missing = requiredVariables.filter((v) => !textVariables.includes(v))

  return {
    valid: missing.length === 0,
    missing,
  }
}

export function getVariablePreview(variables: TemplateVariable[]): Record<string, string> {
  return variables.reduce(
    (acc, variable) => {
      acc[variable.name] = variable.value || `[${variable.name}]`
      return acc
    },
    {} as Record<string, string>,
  )
}
