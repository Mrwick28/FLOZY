'use client'

import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  CheckSquare, 
  MessageSquare, 
  Paperclip,
  MoreHorizontal,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: {
    id: string
    title: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    due_date?: string
    subtasks_total?: number
    subtasks_done?: number
    comments_count?: number
    attachments_count?: number
    assignees?: { avatar_url: string; name: string }[]
  }
  index: number
  onClick?: (id: string) => void
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600'
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick?.(task.id)}
          className={cn(
            "mb-3 transition-all cursor-pointer",
            snapshot.isDragging && "scale-105 z-50 shadow-xl"
          )}
        >
          <Card className="hover:border-slate-400 transition-all shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="secondary" className={cn("text-[10px] uppercase tracking-wider font-bold h-5", priorityColors[task.priority])}>
                  {task.priority}
                </Badge>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                {task.title}
              </h4>
              
              <div className="flex flex-wrap items-center gap-3 text-slate-400 text-xs mt-2">
                {task.due_date && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(task.due_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
                
                {(task.subtasks_total || 0) > 0 && (
                  <div className="flex items-center gap-1">
                    <CheckSquare className="h-3 w-3" />
                    <span>{task.subtasks_done}/{task.subtasks_total}</span>
                  </div>
                )}
                
                {(task.comments_count || 0) > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{task.comments_count}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex -space-x-2">
                  {task.assignees?.map((assignee, i) => (
                    <div 
                      key={i}
                      className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden"
                      title={assignee.name}
                    >
                      {assignee.avatar_url ? (
                        <img src={assignee.avatar_url} alt={assignee.name} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-3 w-3 text-slate-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}
