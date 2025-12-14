// "use client"

// import type React from "react"
// import type { Editor } from "@tiptap/react"
// import {
//   Bold,
//   Italic,
//   Underline,
//   Strikethrough,
//   Link,
//   List,
//   ListOrdered,
//   Heading1,
//   Heading2,
//   Heading3,
//   Quote,
//   Code,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   AlignJustify,
//   Minus,
//   Undo,
//   Redo,
//   Highlighter,
//   ImageIcon,
//   Palette,
//   Type,
//   Keyboard,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useState } from "react"
// import { ImageUploadDialog } from "./image-upload-dialog"
// import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog"

// interface RichTextToolbarProps {
//   editor: Editor | null
// }

// const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px"]
// const TEXT_COLORS = [
//   "#000000",
//   "#374151",
//   "#6B7280",
//   "#9CA3AF",
//   "#EF4444",
//   "#F59E0B",
//   "#10B981",
//   "#3B82F6",
//   "#8B5CF6",
//   "#EC4899",
//   "#14B8A6",
//   "#F97316",
// ]

// export function RichTextToolbar({ editor }: RichTextToolbarProps) {
//   const [showLinkDialog, setShowLinkDialog] = useState(false)
//   const [showImageDialog, setShowImageDialog] = useState(false)
//   const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)
//   const [linkUrl, setLinkUrl] = useState("")
//   const [linkText, setLinkText] = useState("")

//   if (!editor) {
//     return null
//   }

//   const handleInsertLink = () => {
//     if (!linkUrl) return

//     if (linkText) {
//       editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
//     } else {
//       editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
//     }

//     setShowLinkDialog(false)
//     setLinkUrl("")
//     setLinkText("")
//   }

//   const handleOpenLinkDialog = () => {
//     const { from, to } = editor.state.selection
//     const text = editor.state.doc.textBetween(from, to)
//     setLinkText(text)

//     const previousUrl = editor.getAttributes("link").href
//     setLinkUrl(previousUrl || "")

//     setShowLinkDialog(true)
//   }

//   const handleImageSelect = (imageUrl: string, alt?: string) => {
//     editor
//       .chain()
//       .focus()
//       .setImage({ src: imageUrl, alt: alt || "" })
//       .run()
//   }

//   const handleTextColor = (color: string) => {
//     editor.chain().focus().setColor(color).run()
//   }

//   const handleHighlightColor = (color: string) => {
//     editor.chain().focus().toggleHighlight({ color }).run()
//   }

//   const handleFontSize = (size: string) => {
//     editor.chain().focus().setFontSize(size).run()
//   }

//   const ToolbarButton = ({
//     onClick,
//     isActive,
//     disabled,
//     tooltip,
//     children,
//   }: {
//     onClick: () => void
//     isActive?: boolean
//     disabled?: boolean
//     tooltip: string
//     children: React.ReactNode
//   }) => (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button
//             variant={isActive ? "secondary" : "ghost"}
//             size="icon"
//             className="h-8 w-8"
//             onClick={onClick}
//             disabled={disabled}
//           >
//             {children}
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>{tooltip}</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   )

//   return (
//     <>
//       <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 bg-muted/20 flex-wrap">
//         {/* Text style */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           isActive={editor.isActive("bold")}
//           tooltip="Bold (Ctrl+B)"
//         >
//           <Bold className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           isActive={editor.isActive("italic")}
//           tooltip="Italic (Ctrl+I)"
//         >
//           <Italic className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           isActive={editor.isActive("underline")}
//           tooltip="Underline (Ctrl+U)"
//         >
//           <Underline className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           isActive={editor.isActive("strike")}
//           tooltip="Strikethrough"
//         >
//           <Strikethrough className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Type className="w-4 h-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-40 p-2">
//             <div className="space-y-1">
//               <p className="text-xs font-medium mb-2">Font Size</p>
//               {FONT_SIZES.map((size) => (
//                 <Button
//                   key={size}
//                   variant="ghost"
//                   size="sm"
//                   className="w-full justify-start h-8"
//                   onClick={() => handleFontSize(size)}
//                 >
//                   {size}
//                 </Button>
//               ))}
//             </div>
//           </PopoverContent>
//         </Popover>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Palette className="w-4 h-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-52 p-3">
//             <div className="space-y-2">
//               <p className="text-xs font-medium">Text Color</p>
//               <div className="grid grid-cols-4 gap-2">
//                 {TEXT_COLORS.map((color) => (
//                   <button
//                     key={color}
//                     className="w-10 h-10 rounded border-2 border-border hover:border-primary transition-colors"
//                     style={{ backgroundColor: color }}
//                     onClick={() => handleTextColor(color)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </PopoverContent>
//         </Popover>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant={editor.isActive("highlight") ? "secondary" : "ghost"} size="icon" className="h-8 w-8">
//               <Highlighter className="w-4 h-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-52 p-3">
//             <div className="space-y-2">
//               <p className="text-xs font-medium">Highlight Color</p>
//               <div className="grid grid-cols-4 gap-2">
//                 {TEXT_COLORS.slice(4).map((color) => (
//                   <button
//                     key={color}
//                     className="w-10 h-10 rounded border-2 border-border hover:border-primary transition-colors"
//                     style={{ backgroundColor: color }}
//                     onClick={() => handleHighlightColor(color)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </PopoverContent>
//         </Popover>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Headings */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//           isActive={editor.isActive("heading", { level: 1 })}
//           tooltip="Heading 1"
//         >
//           <Heading1 className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//           isActive={editor.isActive("heading", { level: 2 })}
//           tooltip="Heading 2"
//         >
//           <Heading2 className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//           isActive={editor.isActive("heading", { level: 3 })}
//           tooltip="Heading 3"
//         >
//           <Heading3 className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Lists */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           isActive={editor.isActive("bulletList")}
//           tooltip="Bullet List"
//         >
//           <List className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           isActive={editor.isActive("orderedList")}
//           tooltip="Numbered List"
//         >
//           <ListOrdered className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Alignment */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("left").run()}
//           isActive={editor.isActive({ textAlign: "left" })}
//           tooltip="Align Left"
//         >
//           <AlignLeft className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("center").run()}
//           isActive={editor.isActive({ textAlign: "center" })}
//           tooltip="Align Center"
//         >
//           <AlignCenter className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("right").run()}
//           isActive={editor.isActive({ textAlign: "right" })}
//           tooltip="Align Right"
//         >
//           <AlignRight className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("justify").run()}
//           isActive={editor.isActive({ textAlign: "justify" })}
//           tooltip="Justify"
//         >
//           <AlignJustify className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Block Elements */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           isActive={editor.isActive("blockquote")}
//           tooltip="Quote"
//         >
//           <Quote className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//           isActive={editor.isActive("codeBlock")}
//           tooltip="Code Block"
//         >
//           <Code className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="Horizontal Line">
//           <Minus className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Other */}
//         <ToolbarButton onClick={() => setShowImageDialog(true)} tooltip="Insert Image">
//           <ImageIcon className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton onClick={handleOpenLinkDialog} isActive={editor.isActive("link")} tooltip="Insert Link (Ctrl+K)">
//           <Link className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="Horizontal Rule">
//           <Minus className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Undo/Redo */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().undo().run()}
//           disabled={!editor.can().undo()}
//           tooltip="Undo (Ctrl+Z)"
//         >
//           <Undo className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().redo().run()}
//           disabled={!editor.can().redo()}
//           tooltip="Redo (Ctrl+Y)"
//         >
//           <Redo className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         <ToolbarButton onClick={() => setShowShortcutsDialog(true)} tooltip="Keyboard Shortcuts">
//           <Keyboard className="w-4 h-4" />
//         </ToolbarButton>
//       </div>

//       {/* Link Dialog */}
//       <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Insert Link</DialogTitle>
//             <DialogDescription>Add a hyperlink to your email content.</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="link-url">URL *</Label>
//               <Input
//                 id="link-url"
//                 placeholder="https://example.com"
//                 value={linkUrl}
//                 onChange={(e) => setLinkUrl(e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="link-text">Link Text</Label>
//               <Input
//                 id="link-text"
//                 placeholder="Click here (optional)"
//                 value={linkText}
//                 onChange={(e) => setLinkText(e.target.value)}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleInsertLink}>Insert Link</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Image Upload Dialog */}
//       <ImageUploadDialog
//         open={showImageDialog}
//         onOpenChange={setShowImageDialog}
//         onImageSelect={handleImageSelect}
//         existingImages={[]}
//       />

//       <KeyboardShortcutsDialog open={showShortcutsDialog} onOpenChange={setShowShortcutsDialog} />
//     </>
//   )
// }

// "use client"

// import type React from "react"
// import type { Editor } from "@tiptap/react"
// import {
//   Bold,
//   Italic,
//   Underline,
//   Strikethrough,
//   Link,
//   List,
//   ListOrdered,
//   Heading1,
//   Heading2,
//   Heading3,
//   Quote,
//   Code,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   AlignJustify,
//   Minus,
//   Undo,
//   Redo,
//   Highlighter,
//   ImageIcon,
//   Palette,
//   Type,
//   Keyboard,
//   MousePointerClick,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useState } from "react"
// import { ImageUploadDialog } from "./image-upload-dialog"
// import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog"

// interface RichTextToolbarProps {
//   editor: Editor | null
// }

// const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px"]
// const TEXT_COLORS = [
//   "#000000",
//   "#374151",
//   "#6B7280",
//   "#9CA3AF",
//   "#EF4444",
//   "#F59E0B",
//   "#10B981",
//   "#3B82F6",
//   "#8B5CF6",
//   "#EC4899",
//   "#14B8A6",
//   "#F97316",
// ]

// export function RichTextToolbar({ editor }: RichTextToolbarProps) {
//   const [showLinkDialog, setShowLinkDialog] = useState(false)
//   const [showImageDialog, setShowImageDialog] = useState(false)
//   const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)
//   const [showButtonDialog, setShowButtonDialog] = useState(false) // Added button dialog state
//   const [linkUrl, setLinkUrl] = useState("")
//   const [linkText, setLinkText] = useState("")
//   const [buttonText, setButtonText] = useState("Click Here")
//   const [buttonUrl, setButtonUrl] = useState("")
//   const [buttonStyle, setButtonStyle] = useState("primary")

//   if (!editor) {
//     return null
//   }

//   const handleInsertLink = () => {
//     if (!linkUrl) return

//     if (linkText) {
//       editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
//     } else {
//       editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
//     }

//     setShowLinkDialog(false)
//     setLinkUrl("")
//     setLinkText("")
//   }

//   const handleOpenLinkDialog = () => {
//     const { from, to } = editor.state.selection
//     const text = editor.state.doc.textBetween(from, to)
//     setLinkText(text)

//     const previousUrl = editor.getAttributes("link").href
//     setLinkUrl(previousUrl || "")

//     setShowLinkDialog(true)
//   }

//   const handleImageSelect = (imageUrl: string, alt?: string) => {
//     editor
//       .chain()
//       .focus()
//       .setImage({ src: imageUrl, alt: alt || "" })
//       .run()
//   }

//   const handleTextColor = (color: string) => {
//     editor.chain().focus().setColor(color).run()
//   }

//   const handleHighlightColor = (color: string) => {
//     editor.chain().focus().toggleHighlight({ color }).run()
//   }

//   const handleFontSize = (size: string) => {
//     editor.chain().focus().setFontSize(size).run()
//   }

//   const handleInsertButton = () => {
//     if (!buttonUrl || !buttonText) return

//     const buttonStyles = {
//       primary:
//         "background: #3B82F6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;",
//       secondary:
//         "background: #10B981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;",
//       outline:
//         "background: transparent; color: #3B82F6; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: 2px solid #3B82F6;",
//       ghost:
//         "background: #F3F4F6; color: #374151; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;",
//     }

//     const buttonHTML = `
//       <p style="text-align: center; margin: 30px 0;">
//         <a href="${buttonUrl}" style="${buttonStyles[buttonStyle as keyof typeof buttonStyles]}">${buttonText}</a>
//       </p>
//     `

//     editor.chain().focus().insertContent(buttonHTML).run()

//     setShowButtonDialog(false)
//     setButtonText("Click Here")
//     setButtonUrl("")
//     setButtonStyle("primary")
//   }

//   const ToolbarButton = ({
//     onClick,
//     isActive,
//     disabled,
//     tooltip,
//     children,
//   }: {
//     onClick: () => void
//     isActive?: boolean
//     disabled?: boolean
//     tooltip: string
//     children: React.ReactNode
//   }) => (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button
//             variant={isActive ? "secondary" : "ghost"}
//             size="icon"
//             className="h-8 w-8"
//             onClick={onClick}
//             disabled={disabled}
//           >
//             {children}
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>{tooltip}</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   )

//   return (
//     <>
//       <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 bg-muted/20 flex-wrap">
//         {/* Text style */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           isActive={editor.isActive("bold")}
//           tooltip="Bold (Ctrl+B)"
//         >
//           <Bold className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           isActive={editor.isActive("italic")}
//           tooltip="Italic (Ctrl+I)"
//         >
//           <Italic className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           isActive={editor.isActive("underline")}
//           tooltip="Underline (Ctrl+U)"
//         >
//           <Underline className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           isActive={editor.isActive("strike")}
//           tooltip="Strikethrough"
//         >
//           <Strikethrough className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Type className="w-4 h-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-40 p-2">
//             <div className="space-y-1">
//               <p className="text-xs font-medium mb-2">Font Size</p>
//               {FONT_SIZES.map((size) => (
//                 <Button
//                   key={size}
//                   variant="ghost"
//                   size="sm"
//                   className="w-full justify-start h-8"
//                   onClick={() => handleFontSize(size)}
//                 >
//                   {size}
//                 </Button>
//               ))}
//             </div>
//           </PopoverContent>
//         </Popover>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Palette className="w-4 h-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-52 p-3">
//             <div className="space-y-2">
//               <p className="text-xs font-medium">Text Color</p>
//               <div className="grid grid-cols-4 gap-2">
//                 {TEXT_COLORS.map((color) => (
//                   <button
//                     key={color}
//                     className="w-10 h-10 rounded border-2 border-border hover:border-primary transition-colors"
//                     style={{ backgroundColor: color }}
//                     onClick={() => handleTextColor(color)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </PopoverContent>
//         </Popover>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant={editor.isActive("highlight") ? "secondary" : "ghost"} size="icon" className="h-8 w-8">
//               <Highlighter className="w-4 h-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-52 p-3">
//             <div className="space-y-2">
//               <p className="text-xs font-medium">Highlight Color</p>
//               <div className="grid grid-cols-4 gap-2">
//                 {TEXT_COLORS.slice(4).map((color) => (
//                   <button
//                     key={color}
//                     className="w-10 h-10 rounded border-2 border-border hover:border-primary/50 transition-colors"
//                     style={{ backgroundColor: color }}
//                     onClick={() => handleHighlightColor(color)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </PopoverContent>
//         </Popover>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Headings */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//           isActive={editor.isActive("heading", { level: 1 })}
//           tooltip="Heading 1"
//         >
//           <Heading1 className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//           isActive={editor.isActive("heading", { level: 2 })}
//           tooltip="Heading 2"
//         >
//           <Heading2 className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//           isActive={editor.isActive("heading", { level: 3 })}
//           tooltip="Heading 3"
//         >
//           <Heading3 className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Lists */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           isActive={editor.isActive("bulletList")}
//           tooltip="Bullet List"
//         >
//           <List className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           isActive={editor.isActive("orderedList")}
//           tooltip="Numbered List"
//         >
//           <ListOrdered className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Alignment */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("left").run()}
//           isActive={editor.isActive({ textAlign: "left" })}
//           tooltip="Align Left"
//         >
//           <AlignLeft className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("center").run()}
//           isActive={editor.isActive({ textAlign: "center" })}
//           tooltip="Align Center"
//         >
//           <AlignCenter className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("right").run()}
//           isActive={editor.isActive({ textAlign: "right" })}
//           tooltip="Align Right"
//         >
//           <AlignRight className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().setTextAlign("justify").run()}
//           isActive={editor.isActive({ textAlign: "justify" })}
//           tooltip="Justify"
//         >
//           <AlignJustify className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Block Elements */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           isActive={editor.isActive("blockquote")}
//           tooltip="Quote"
//         >
//           <Quote className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//           isActive={editor.isActive("codeBlock")}
//           tooltip="Code Block"
//         >
//           <Code className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="Horizontal Line">
//           <Minus className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Other */}
//         <ToolbarButton onClick={() => setShowImageDialog(true)} tooltip="Insert Image">
//           <ImageIcon className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton onClick={handleOpenLinkDialog} isActive={editor.isActive("link")} tooltip="Insert Link (Ctrl+K)">
//           <Link className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton onClick={() => setShowButtonDialog(true)} tooltip="Insert CTA Button">
//           <MousePointerClick className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="Horizontal Rule">
//           <Minus className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         {/* Undo/Redo */}
//         <ToolbarButton
//           onClick={() => editor.chain().focus().undo().run()}
//           disabled={!editor.can().undo()}
//           tooltip="Undo (Ctrl+Z)"
//         >
//           <Undo className="w-4 h-4" />
//         </ToolbarButton>

//         <ToolbarButton
//           onClick={() => editor.chain().focus().redo().run()}
//           disabled={!editor.can().redo()}
//           tooltip="Redo (Ctrl+Y)"
//         >
//           <Redo className="w-4 h-4" />
//         </ToolbarButton>

//         <Separator orientation="vertical" className="h-6 mx-1" />

//         <ToolbarButton onClick={() => setShowShortcutsDialog(true)} tooltip="Keyboard Shortcuts">
//           <Keyboard className="w-4 h-4" />
//         </ToolbarButton>
//       </div>

//       {/* Link Dialog */}
//       <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Insert Link</DialogTitle>
//             <DialogDescription>Add a hyperlink to your email content.</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="link-url">URL *</Label>
//               <Input
//                 id="link-url"
//                 placeholder="https://example.com"
//                 value={linkUrl}
//                 onChange={(e) => setLinkUrl(e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="link-text">Link Text</Label>
//               <Input
//                 id="link-text"
//                 placeholder="Click here (optional)"
//                 value={linkText}
//                 onChange={(e) => setLinkText(e.target.value)}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleInsertLink}>Insert Link</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Image Upload Dialog */}
//       <ImageUploadDialog
//         open={showImageDialog}
//         onOpenChange={setShowImageDialog}
//         onImageSelect={handleImageSelect}
//         existingImages={[]}
//       />

//       {/* CTA Button Dialog */}
//       <Dialog open={showButtonDialog} onOpenChange={setShowButtonDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Insert CTA Button</DialogTitle>
//             <DialogDescription>Create a call-to-action button for your email.</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="button-text">Button Text *</Label>
//               <Input
//                 id="button-text"
//                 placeholder="e.g., Schedule a Call, Get Started, Learn More"
//                 value={buttonText}
//                 onChange={(e) => setButtonText(e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="button-url">Button URL *</Label>
//               <Input
//                 id="button-url"
//                 placeholder="https://example.com"
//                 value={buttonUrl}
//                 onChange={(e) => setButtonUrl(e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="button-style">Button Style</Label>
//               <div className="grid grid-cols-2 gap-2">
//                 <button
//                   className={`p-3 text-center rounded border-2 transition-all ${
//                     buttonStyle === "primary" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
//                   }`}
//                   onClick={() => setButtonStyle("primary")}
//                 >
//                   <div className="bg-blue-600 text-white py-2 px-4 rounded text-sm font-bold">Primary</div>
//                 </button>
//                 <button
//                   className={`p-3 text-center rounded border-2 transition-all ${
//                     buttonStyle === "secondary"
//                       ? "border-primary bg-primary/10"
//                       : "border-border hover:border-primary/50"
//                   }`}
//                   onClick={() => setButtonStyle("secondary")}
//                 >
//                   <div className="bg-green-600 text-white py-2 px-4 rounded text-sm font-bold">Secondary</div>
//                 </button>
//                 <button
//                   className={`p-3 text-center rounded border-2 transition-all ${
//                     buttonStyle === "outline" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
//                   }`}
//                   onClick={() => setButtonStyle("outline")}
//                 >
//                   <div className="border-2 border-blue-600 text-blue-600 py-2 px-4 rounded text-sm font-bold">
//                     Outline
//                   </div>
//                 </button>
//                 <button
//                   className={`p-3 text-center rounded border-2 transition-all ${
//                     buttonStyle === "ghost" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
//                   }`}
//                   onClick={() => setButtonStyle("ghost")}
//                 >
//                   <div className="bg-gray-100 text-gray-800 py-2 px-4 rounded text-sm font-bold">Ghost</div>
//                 </button>
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowButtonDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleInsertButton} disabled={!buttonText || !buttonUrl}>
//               Insert Button
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <KeyboardShortcutsDialog open={showShortcutsDialog} onOpenChange={setShowShortcutsDialog} />
//     </>
//   )
// }

"use client"

import type React from "react"
import type { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Undo,
  Redo,
  Highlighter,
  ImageIcon,
  Palette,
  Type,
  Keyboard,
  MousePointerClick,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { ImageUploadDialog } from "./image-upload-dialog"
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog"

interface RichTextToolbarProps {
  editor: Editor | null
}

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px"]
const TEXT_COLORS = [
  "#000000",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
]

export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)
  const [showButtonDialog, setShowButtonDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [buttonText, setButtonText] = useState("Click Here")
  const [buttonUrl, setButtonUrl] = useState("")
  const [buttonStyle, setButtonStyle] = useState("primary")

  if (!editor) {
    return null
  }

  const handleInsertLink = () => {
    if (!linkUrl) return

    if (linkText) {
      editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    }

    setShowLinkDialog(false)
    setLinkUrl("")
    setLinkText("")
  }

  const handleOpenLinkDialog = () => {
    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to)
    setLinkText(text)

    const previousUrl = editor.getAttributes("link").href
    setLinkUrl(previousUrl || "")

    setShowLinkDialog(true)
  }

  const handleImageSelect = (imageUrl: string, alt?: string) => {
    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl, alt: alt || "" })
      .run()
  }

  const handleTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const handleHighlightColor = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run()
  }

  const handleFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run()
  }

  const handleInsertButton = () => {
    if (!buttonUrl || !buttonText) return

    // Use the custom button command
    editor
      .chain()
      .focus()
      .setButton({
        href: buttonUrl,
        text: buttonText,
        style: buttonStyle,
      })
      .run()

    setShowButtonDialog(false)
    setButtonText("Click Here")
    setButtonUrl("")
    setButtonStyle("primary")
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    tooltip,
    children,
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    tooltip: string
    children: React.ReactNode
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={onClick}
            disabled={disabled}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <>
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 bg-muted/20 flex-wrap">
        {/* Text style */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          tooltip="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Type className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <div className="space-y-1">
              <p className="text-xs font-medium mb-2">Font Size</p>
              {FONT_SIZES.map((size) => (
                <Button
                  key={size}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleFontSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-3">
            <div className="space-y-2">
              <p className="text-xs font-medium">Text Color</p>
              <div className="grid grid-cols-4 gap-2">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => handleTextColor(color)}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant={editor.isActive("highlight") ? "secondary" : "ghost"} size="icon" className="h-8 w-8">
              <Highlighter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-3">
            <div className="space-y-2">
              <p className="text-xs font-medium">Highlight Color</p>
              <div className="grid grid-cols-4 gap-2">
                {TEXT_COLORS.slice(4).map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded border-2 border-border hover:border-primary/50 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => handleHighlightColor(color)}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          tooltip="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          tooltip="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          tooltip="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          tooltip="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          tooltip="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          tooltip="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          tooltip="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Block Elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          tooltip="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          tooltip="Code Block"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="Horizontal Line">
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Other */}
        <ToolbarButton onClick={() => setShowImageDialog(true)} tooltip="Insert Image">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={handleOpenLinkDialog} isActive={editor.isActive("link")} tooltip="Insert Link (Ctrl+K)">
          <Link className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={() => setShowButtonDialog(true)} tooltip="Insert CTA Button">
          <MousePointerClick className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="Horizontal Rule">
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <ToolbarButton onClick={() => setShowShortcutsDialog(true)} tooltip="Keyboard Shortcuts">
          <Keyboard className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>Add a hyperlink to your email content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-text">Link Text</Label>
              <Input
                id="link-text"
                placeholder="Click here (optional)"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsertLink}>Insert Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <ImageUploadDialog
        open={showImageDialog}
        onOpenChange={setShowImageDialog}
        onImageSelect={handleImageSelect}
        existingImages={[]}
      />

      {/* CTA Button Dialog */}
      <Dialog open={showButtonDialog} onOpenChange={setShowButtonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert CTA Button</DialogTitle>
            <DialogDescription>Create a call-to-action button for your email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="button-text">Button Text *</Label>
              <Input
                id="button-text"
                placeholder="e.g., Schedule a Call, Get Started, Learn More"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="button-url">Button URL *</Label>
              <Input
                id="button-url"
                placeholder="https://example.com"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="button-style">Button Style</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`p-3 text-center rounded border-2 transition-all ${
                    buttonStyle === "primary" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setButtonStyle("primary")}
                >
                  <div className="bg-blue-600 text-white py-2 px-4 rounded text-sm font-bold">Primary</div>
                </button>
                <button
                  type="button"
                  className={`p-3 text-center rounded border-2 transition-all ${
                    buttonStyle === "secondary"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setButtonStyle("secondary")}
                >
                  <div className="bg-green-600 text-white py-2 px-4 rounded text-sm font-bold">Secondary</div>
                </button>
                <button
                  type="button"
                  className={`p-3 text-center rounded border-2 transition-all ${
                    buttonStyle === "outline" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setButtonStyle("outline")}
                >
                  <div className="border-2 border-blue-600 text-blue-600 py-2 px-4 rounded text-sm font-bold">
                    Outline
                  </div>
                </button>
                <button
                  type="button"
                  className={`p-3 text-center rounded border-2 transition-all ${
                    buttonStyle === "ghost" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setButtonStyle("ghost")}
                >
                  <div className="bg-gray-100 text-gray-800 py-2 px-4 rounded text-sm font-bold">Ghost</div>
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowButtonDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsertButton} disabled={!buttonText || !buttonUrl}>
              Insert Button
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <KeyboardShortcutsDialog open={showShortcutsDialog} onOpenChange={setShowShortcutsDialog} />
    </>
  )
}