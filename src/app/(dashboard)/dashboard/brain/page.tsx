'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageExplorer } from '@/components/brain/PageExplorer'
import dynamic from 'next/dynamic'
import { 
  MoreHorizontal, 
  Share2, 
  Clock, 
  Settings,
  Star,
  Maximize2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { debounce } from 'lodash'

// Dynamically import BlockEditor to avoid SSR issues
const BlockEditor = dynamic(() => import('@/components/editor/BlockEditor'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-50 animate-pulse rounded-xl" />
})

export default function BrainPage() {
  const [activePageId, setActivePageId] = useState<string | null>(null)
  const [pageData, setPageData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (activePageId) {
      fetchPageContent(activePageId)
    }
  }, [activePageId])

  const fetchPageContent = async (id: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('brain_pages')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      toast.error('Failed to load page content')
    } else {
      setPageData(data)
    }
    setLoading(false)
  }

  // Auto-save logic
  const saveContent = useCallback(
    debounce(async (id: string, content: string) => {
      const { error } = await supabase
        .from('brain_pages')
        .update({ 
          content: JSON.parse(content),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Auto-save failed:', error)
      }
    }, 1000),
    []
  )

  const handleTitleChange = async (newTitle: string) => {
    setPageData({ ...pageData, title: newTitle })
    const { error } = await supabase
      .from('brain_pages')
      .update({ title: newTitle })
      .eq('id', activePageId)

    if (error) {
      toast.error('Failed to update title')
    }
  }

  return (
    <div className="flex -m-8 h-[calc(100vh-64px)] bg-white overflow-hidden">
      <PageExplorer 
        activePageId={activePageId} 
        onPageSelect={setActivePageId} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {activePageId && pageData ? (
          <>
            {/* Page Toolbar */}
            <div className="h-12 border-b flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="hover:text-slate-900 cursor-pointer">Workspace</span>
                <span>/</span>
                <span className="font-medium text-slate-600 truncate max-w-[200px]">{pageData.title}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-2">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Clock className="h-4 w-4 text-slate-500" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Star className="h-4 w-4 text-slate-500" />
                </Button>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 overflow-y-auto px-12 md:px-24 py-12">
              <div className="max-w-[800px] mx-auto space-y-8">
                <input
                  type="text"
                  className="w-full text-5xl font-bold border-none outline-none focus:ring-0 placeholder:text-slate-200"
                  placeholder="Untitled"
                  value={pageData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                
                <div className="flex items-center gap-4 py-4 border-b border-transparent hover:border-slate-100 transition-colors group">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-200">
                      U
                    </div>
                    <span>Last edited by Admin</span>
                  </div>
                </div>

                <div className="pb-32">
                  <BlockEditor 
                    initialContent={pageData.content ? JSON.stringify(pageData.content) : null}
                    onChange={(json) => saveContent(activePageId, json)}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center">
              <Maximize2 className="h-10 w-10 text-slate-200" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-slate-900">Select a page to view</p>
              <p className="text-sm">Or create a new one to start writing.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
