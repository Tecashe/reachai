
"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import Color from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import { Extension, Node, mergeAttributes } from "@tiptap/core"
import { Plugin, PluginKey } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

// Declare the button command types
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    button: {
      setButton: (options: { href: string; text: string; style: string }) => ReturnType
    }
  }
}

// Font Size Extension
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {}
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run()
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run()
        },
    }
  },
})

// Button Extension
const Button = Node.create({
  name: "button",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      href: {
        default: null,
      },
      text: {
        default: "Click Here",
      },
      style: {
        default: "primary",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="button"]',
      },
    ]
  },

  renderHTML({ node }) {
    const { href, text, style } = node.attrs

    const buttonConfigs = {
      primary: {
        bgColor: "#3B82F6",
        textColor: "#ffffff",
        borderColor: "#3B82F6",
      },
      secondary: {
        bgColor: "#10B981",
        textColor: "#ffffff",
        borderColor: "#10B981",
      },
      outline: {
        bgColor: "#ffffff",
        textColor: "#3B82F6",
        borderColor: "#3B82F6",
      },
      ghost: {
        bgColor: "#F3F4F6",
        textColor: "#374151",
        borderColor: "#E5E7EB",
      },
    }

    const config = buttonConfigs[style as keyof typeof buttonConfigs] || buttonConfigs.primary

    return [
      "div",
      {
        "data-type": "button",
        "data-href": href,
        "data-text": text,
        "data-style": style,
        style: "text-align: center; margin: 25px 0;",
      },
      [
        "a",
        {
          href: href,
          target: "_blank",
          rel: "noopener noreferrer",
          style: `
            background-color: ${config.bgColor};
            color: ${config.textColor};
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
            font-size: 16px;
            border: 2px solid ${config.borderColor};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            cursor: pointer;
          `,
        },
        text,
      ],
    ]
  },

  addCommands() {
    return {
      setButton:
        (options: { href: string; text: string; style: string }) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})

// Custom extension to highlight template variables
const VariableHighlight = Extension.create({
  name: "variableHighlight",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("variableHighlight"),
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            const doc = state.doc

            doc.descendants((node, pos) => {
              if (!node.isText) return

              const text = node.text || ""
              const regex = /{{(\s*\w+\s*)}}/g
              let match

              while ((match = regex.exec(text)) !== null) {
                const from = pos + match.index
                const to = from + match[0].length

                decorations.push(
                  Decoration.inline(from, to, {
                    class: "variable-highlight",
                  }),
                )
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
  onEditorReady?: (editor: Editor) => void
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
  className,
  editable = true,
  onEditorReady,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      TextStyle,
      FontSize,
      Button, // ✅ Added Button extension
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      Placeholder.configure({
        placeholder:
          placeholder ||
          `Write your email content here...

Use {{firstName}} syntax to insert dynamic variables.
The preview will update as you type.`,
      }),
      VariableHighlight,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none",
          "focus:outline-none",
          "min-h-[400px] p-4",
          "[&_.variable-highlight]:bg-primary/10 [&_.variable-highlight]:text-primary [&_.variable-highlight]:font-mono [&_.variable-highlight]:text-sm [&_.variable-highlight]:px-1 [&_.variable-highlight]:rounded",
        ),
      },
    },
  })

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor)
    }
  }, [editor, onEditorReady])

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className={cn("relative rounded-md border border-border bg-background", className)}>
      <EditorContent editor={editor} className="prose-editor" />
      <style jsx global>{`
        .prose-editor .ProseMirror {
          outline: none;
        }

        .prose-editor .ProseMirror p.is-editor-empty:first-child::before {
          color: hsl(var(--muted-foreground));
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .prose-editor .ProseMirror ul,
        .prose-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .prose-editor .ProseMirror ul li {
          list-style-type: disc;
        }

        .prose-editor .ProseMirror ol li {
          list-style-type: decimal;
        }

        .prose-editor .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .prose-editor .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .prose-editor .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .prose-editor .ProseMirror a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }

        .prose-editor .ProseMirror strong {
          font-weight: bold;
        }

        .prose-editor .ProseMirror em {
          font-style: italic;
        }

        .prose-editor .ProseMirror u {
          text-decoration: underline;
        }

        .prose-editor .ProseMirror mark {
          background-color: hsl(var(--primary) / 0.2);
          padding: 0.1em 0.2em;
          border-radius: 0.25em;
        }

        .prose-editor .ProseMirror blockquote {
          border-left: 3px solid hsl(var(--border));
          padding-left: 1rem;
          margin: 1rem 0;
          color: hsl(var(--muted-foreground));
        }

        .prose-editor .ProseMirror hr {
          border: none;
          border-top: 2px solid hsl(var(--border));
          margin: 2rem 0;
        }

        .prose-editor .ProseMirror code {
          background-color: hsl(var(--muted));
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: monospace;
          font-size: 0.9em;
        }

        .prose-editor .ProseMirror pre {
          background-color: hsl(var(--muted));
          padding: 1rem;
          border-radius: 0.5em;
          overflow-x: auto;
        }

        .prose-editor .ProseMirror pre code {
          background: none;
          padding: 0;
        }

        .prose-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        /* Button styles in editor */
        .prose-editor .ProseMirror div[data-type="button"] {
          text-align: center;
          margin: 25px 0;
        }

        .prose-editor .ProseMirror div[data-type="button"] a {
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          display: inline-block;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .prose-editor .ProseMirror div[data-type="button"] a:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}

// Export the editor instance type for use in other components
export type { Editor }