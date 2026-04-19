'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'
import { 
  Calendar as CalendarIcon, 
  Trash2, 
  Share2, 
  MoreHorizontal,
  Layout,
  Clock,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'
import { toast } from 'sonner'

const BlockEditor = dynamic(() => import('@/components/editor/BlockEditor'), { 
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-slate-50 animate-pulse rounded-xl" />
})

interface TaskModalProps {
  taskId: string | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: () => void
}

export function TaskModal({ taskId, isOpen, onClose, onUpdate }: TaskModalProps) {
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (taskId && isOpen) {
      fetchTask()
    }
  }, [taskId, isOpen])

  const fetchTask = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()

    if (error) {
      toast.error('Failed to load task')
    } else {
      setTask(data)
    }
    setLoading(false)
  }

  const updateTask = async (updates: any) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)

    if (error) {
      toast.error('Update failed')
    } else {
      setTask({ ...task, ...updates })
      if (onUpdate) onUpdate()
    }
  }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
              <Layout className="h-3 w-3 mr-1" /> Task
            </Badge>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs text-slate-500 font-medium">Internal Project</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          <input
            className="w-full text-4xl font-bold border-none outline-none focus:ring-0 placeholder:text-slate-200"
            value={task.title}
            onChange={(e) => updateTask({ title: e.target.value })}
            placeholder="Task Title"
          />

          {/* Properties Area - Notion Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 py-6 border-y border-slate-50">
            <div className="flex items-center gap-4 group">
              <div className="flex items-center gap-2 w-32 text-slate-400 text-sm">
                <Activity className="h-4 w-4" /> Status
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 capitalize">
                {task.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-32 text-slate-400 text-sm">
                <Clock className="h-4 w-4" /> Due Date
              </div>
              <button className="text-sm font-medium text-slate-700 hover:bg-slate-50 px-2 py-1 rounded transition-colors flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-400" />
                {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No date'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-32 text-slate-400 text-sm">
                <User className="h-4 w-4" /> Assignee
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">A</div>
                <span className="text-sm font-medium">Admin User</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-32 text-slate-400 text-sm">
                <Star className="h-4 w-4" /> Priority
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  "capitalize border-none px-2 py-0.5",
                  task.priority === 'urgent' && "bg-red-100 text-red-700",
                  task.priority === 'high' && "bg-orange-100 text-orange-700",
                  task.priority === 'medium' && "bg-blue-100 text-blue-700",
                  task.priority === 'low' && "bg-slate-100 text-slate-700",
                )}
              >
                {task.priority || 'No priority'}
              </Badge>
            </div>
          </div>

          {/* Block Editor for Description */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">Description</div>
            <BlockEditor 
              initialContent={task.description ? JSON.stringify(task.description) : null}
              onChange={(json) => updateTask({ description: JSON.parse(json) })}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { Activity, Star } from "lucide-react"
import { cn } from '@/lib/utils'
