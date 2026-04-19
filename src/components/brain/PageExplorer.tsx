'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  MoreVertical,
  Trash2,
  FilePlus,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BrainPage {
  id: string
  title: string
  parent_id: string | null
  position: number
}

interface PageExplorerProps {
  onPageSelect: (id: string) => void
  activePageId: string | null
}

export function PageExplorer({ onPageSelect, activePageId }: PageExplorerProps) {
  const [pages, setPages] = useState<BrainPage[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const supabase = createClient()

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('brain_pages')
      .select('id, title, parent_id, position')
      .order('position', { ascending: true })

    if (error) {
      toast.error('Failed to load pages')
    } else {
      setPages(data || [])
    }
    setLoading(false)
  }

  const createPage = async (parentId: string | null = null) => {
    const { data: profile } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('brain_pages')
      .insert([{ 
        title: 'Untitled Page', 
        parent_id: parentId,
        created_by: profile.user?.id 
      }])
      .select()
      .single()

    if (error) {
      toast.error('Failed to create page')
    } else {
      setPages([...pages, data])
      onPageSelect(data.id)
      if (parentId) {
        setExpanded({ ...expanded, [parentId]: true })
      }
    }
  }

  const renderPageItem = (page: BrainPage, depth = 0) => {
    const hasChildren = pages.some(p => p.parent_id === page.id)
    const isExpanded = expanded[page.id]
    const isActive = activePageId === page.id

    return (
      <div key={page.id}>
        <div 
          className={cn(
            "group flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer transition-colors",
            isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => onPageSelect(page.id)}
        >
          <button 
            className="p-0.5 hover:bg-slate-200 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setExpanded({ ...expanded, [page.id]: !isExpanded })
            }}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <div className="w-3.5" />
            )}
          </button>
          <FileText className="h-4 w-4 shrink-0 opacity-70" />
          <span className="text-sm font-medium truncate flex-1">{page.title || 'Untitled'}</span>
          
          <button 
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
            onClick={(e) => {
              e.stopPropagation()
              createPage(page.id)
            }}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-0.5">
            {pages
              .filter(p => p.parent_id === page.id)
              .map(child => renderPageItem(child, depth + 1))
            }
          </div>
        )}
      </div>
    )
  }

  const rootPages = pages.filter(p => p.parent_id === null)

  return (
    <div className="flex flex-col h-full bg-slate-50/50 border-r w-[260px] flex-shrink-0">
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search docs..." 
            className="pl-9 h-9 bg-white shadow-none border-slate-200 focus-visible:ring-1"
          />
        </div>
        
        <div className="flex items-center justify-between px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Your Pages</span>
          <button onClick={() => createPage(null)} className="hover:text-slate-900">
            <FilePlus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {loading ? (
          <div className="px-4 py-2 text-sm text-slate-400">Loading...</div>
        ) : (
          <div className="space-y-1">
            {rootPages.map(page => renderPageItem(page))}
            {rootPages.length === 0 && (
              <div className="px-4 py-8 text-center text-xs text-slate-400">
                <p>No pages yet.</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => createPage(null)}
                  className="text-blue-600 mt-2"
                >
                  Create one →
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
