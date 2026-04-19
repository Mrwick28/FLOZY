'use client'

import React, { useMemo } from "react"
import { BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

interface BlockEditorProps {
  initialContent?: string | null
  onChange?: (jsonContent: string) => void
  editable?: boolean
}

export default function BlockEditor({ 
  initialContent, 
  onChange, 
  editable = true 
}: BlockEditorProps) {
  
  // Parse initial content
  const initialBlocks = useMemo(() => {
    if (!initialContent) return undefined
    try {
      return JSON.parse(initialContent) as PartialBlock[]
    } catch (e) {
      console.error("Failed to parse editor content:", e)
      return undefined
    }
  }, [initialContent])

  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  })

  // Handle content changes
  const handleEditorChange = () => {
    if (onChange) {
      onChange(JSON.stringify(editor.document))
    }
  }

  return (
    <div className="min-h-[300px] w-full bg-white rounded-xl border border-slate-100 p-2 shadow-sm">
      <BlockNoteView 
        editor={editor} 
        onChange={handleEditorChange}
        editable={editable}
        theme="light"
      />
    </div>
  )
}
