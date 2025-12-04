// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Textarea } from "@/components/ui/textarea"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"

// interface VariableTextareaProps {
//   value: string
//   onChange: (value: string) => void
//   placeholder?: string
//   rows?: number
// }

// const VARIABLES = [
//   { name: "firstName", description: "Prospect's first name" },
//   { name: "lastName", description: "Prospect's last name" },
//   { name: "company", description: "Company name" },
//   { name: "jobTitle", description: "Job title" },
//   { name: "email", description: "Email address" },
// ]

// export function VariableTextarea({ value, onChange, placeholder, rows = 3 }: VariableTextareaProps) {
//   const [showVariables, setShowVariables] = useState(false)
//   const [cursorPosition, setCursorPosition] = useState(0)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
//     const newValue = e.target.value
//     const cursorPos = e.target.selectionStart
    
//     onChange(newValue)
//     setCursorPosition(cursorPos)

//     // Show variables dropdown when typing {
//     const lastChar = newValue[cursorPos - 1]
//     if (lastChar === "{") {
//       setShowVariables(true)
//     } else if (lastChar === "}" || lastChar === " ") {
//       setShowVariables(false)
//     }
//   }

//   function insertVariable(variableName: string) {
//     const textarea = textareaRef.current
//     if (!textarea) return

//     const beforeCursor = value.substring(0, cursorPosition)
//     const afterCursor = value.substring(cursorPosition)
    
//     // Remove the { that triggered the dropdown
//     const newBeforeCursor = beforeCursor.endsWith("{") ? beforeCursor.slice(0, -1) : beforeCursor
    
//     const newValue = `${newBeforeCursor}{{${variableName}}}${afterCursor}`
//     onChange(newValue)
//     setShowVariables(false)

//     // Set cursor position after the inserted variable
//     setTimeout(() => {
//       const newCursorPos = newBeforeCursor.length + variableName.length + 4
//       textarea.selectionStart = newCursorPos
//       textarea.selectionEnd = newCursorPos
//       textarea.focus()
//     }, 0)
//   }

//   return (
//     <div className="relative">
//       <Textarea
//         ref={textareaRef}
//         value={value}
//         onChange={handleTextChange}
//         placeholder={placeholder}
//         rows={rows}
//         className="font-mono text-sm"
//       />
      
//       {showVariables && (
//         <Card className="absolute top-full left-0 mt-1 w-64 z-50 p-2 shadow-lg">
//           <p className="text-xs text-muted-foreground mb-2 px-2">Available variables:</p>
//           <div className="space-y-1">
//             {VARIABLES.map((variable) => (
//               <Button
//                 key={variable.name}
//                 variant="ghost"
//                 size="sm"
//                 className="w-full justify-start text-left"
//                 onClick={() => insertVariable(variable.name)}
//               >
//                 <span className="font-mono text-primary">{`{{${variable.name}}}`}</span>
//                 <span className="ml-2 text-xs text-muted-foreground">- {variable.description}</span>
//               </Button>
//             ))}
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VariableTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

const VARIABLES = [
  { name: "firstName", description: "Prospect's first name" },
  { name: "lastName", description: "Prospect's last name" },
  { name: "company", description: "Company name" },
  { name: "jobTitle", description: "Job title" },
  { name: "email", description: "Email address" },
]

export function VariableTextarea({ value, onChange, placeholder, rows = 3 }: VariableTextareaProps) {
  const [showVariables, setShowVariables] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart

    onChange(newValue)
    setCursorPosition(cursorPos)

    const lastChar = newValue[cursorPos - 1]
    if (lastChar === "{") {
      setShowVariables(true)
    } else if (lastChar === "}" || lastChar === " ") {
      setShowVariables(false)
    }
  }

  function insertVariable(variableName: string) {
    const textarea = textareaRef.current
    if (!textarea) return

    const beforeCursor = value.substring(0, cursorPosition)
    const afterCursor = value.substring(cursorPosition)

    const newBeforeCursor = beforeCursor.endsWith("{") ? beforeCursor.slice(0, -1) : beforeCursor

    const newValue = `${newBeforeCursor}{{${variableName}}}${afterCursor}`
    onChange(newValue)
    setShowVariables(false)

    setTimeout(() => {
      const newCursorPos = newBeforeCursor.length + variableName.length + 4
      textarea.selectionStart = newCursorPos
      textarea.selectionEnd = newCursorPos
      textarea.focus()
    }, 0)
  }

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "font-mono text-sm rounded-xl border-border/50 bg-muted/20",
          "focus-visible:ring-primary/20 focus-visible:border-primary/50",
          "resize-none",
        )}
      />

      {showVariables && (
        <Card className="absolute top-full left-0 mt-2 w-72 z-50 p-2 shadow-xl rounded-xl border-border/50 bg-background/95 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground mb-2 px-2 font-medium">Available variables:</p>
          <div className="space-y-1">
            {VARIABLES.map((variable) => (
              <Button
                key={variable.name}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left h-9 rounded-lg hover:bg-accent"
                onClick={() => insertVariable(variable.name)}
              >
                <span className="font-mono text-primary text-xs">{`{{${variable.name}}}`}</span>
                <span className="ml-2 text-xs text-muted-foreground">- {variable.description}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
