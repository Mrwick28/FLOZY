'use client'

import React from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { TaskCard } from './TaskCard'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KanbanColumnProps {
  column: {
    id: string
    title: string
    taskIds: string[]
  }
  tasks: Record<string, any>
  onTaskClick?: (id: string) => void
}

export function KanbanColumn({ column, tasks, onTaskClick }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-[320px] bg-slate-50/50 rounded-xl border border-slate-200/60 max-h-full">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-700">{column.title}</h3>
          <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {column.taskIds.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 transition-colors min-h-[150px] ${
              snapshot.isDraggingOver ? 'bg-slate-100/80' : ''
            }`}
          >
            {column.taskIds.map((taskId, index) => (
              <TaskCard key={taskId} task={tasks[taskId]} index={index} onClick={onTaskClick} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      <div className="p-3 bg-transparent border-t border-dashed border-slate-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  )
}
