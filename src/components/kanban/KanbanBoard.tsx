'use client'

import React, { useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  initialData: {
    tasks: Record<string, any>
    columns: Record<string, { id: string; title: string; taskIds: string[] }>
    columnOrder: string[]
  }
  onDragEnd: (result: DropResult) => void
  onTaskClick?: (id: string) => void
}

export function KanbanBoard({ initialData, onDragEnd, onTaskClick }: KanbanBoardProps) {
  const [data, setData] = useState(initialData)

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = data.columns[source.droppableId]
    const finish = data.columns[destination.droppableId]

    // Moving within the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      }

      setData(newState)
      onDragEnd(result)
      return
    }

    // Moving from one column to another
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }

    setData(newState)
    onDragEnd(result)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[600px] items-start">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId]
          return <KanbanColumn key={column.id} column={column} tasks={data.tasks} onTaskClick={onTaskClick} />
        })}
        
        <button className="flex-shrink-0 w-[320px] h-12 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium">
          + Add Column
        </button>
      </div>
    </DragDropContext>
  )
}
