'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { TaskModal } from '@/components/kanban/TaskModal'
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Layers,
  Layout,
  Workflow,
  Table as TableIcon,
  Kanban,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBranding } from '@/components/providers/BrandingProvider'
import { toast } from 'sonner'
import { DropResult } from '@hello-pangea/dnd'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function FlowsPage() {
  const supabase = createClient()
  const { brandColor } = useBranding()
  
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'board' | 'table'>('board')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchFlowData()
  }, [])

  const fetchFlowData = async () => {
    setLoading(true)
    
    // Fetch the first active flow or default
    const { data: flows, error: flowError } = await supabase
      .from('flows')
      .select('*')
      .limit(1)

    if (flowError) {
      toast.error('Failed to load flows')
      setLoading(false)
      return
    }

    const flowId = flows?.[0]?.id

    if (!flowId) {
      await createDefaultFlow()
      return
    }

    const { data: columns, error: colError } = await supabase
      .from('flow_columns')
      .select('*')
      .eq('flow_id', flowId)
      .order('position', { ascending: true })

    const { data: tasks, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('flow_id', flowId)

    if (colError || taskError) {
      toast.error('Failed to load board data')
      setLoading(false)
      return
    }

    // Transform into unified format
    const transformedTasks: Record<string, any> = {}
    tasks?.forEach(task => {
      transformedTasks[task.id] = {
        ...task,
        priority: task.priority || 'medium',
      }
    })

    const transformedColumns: Record<string, any> = {}
    const columnOrder: string[] = []
    
    columns?.forEach(col => {
      columnOrder.push(col.id)
      transformedColumns[col.id] = {
        id: col.id,
        title: col.title,
        taskIds: tasks?.filter(t => t.column_id === col.id).map(t => t.id) || []
      }
    })

    setData({
      tasks: transformedTasks,
      columns: transformedColumns,
      columnOrder
    })
    setLoading(false)
  }

  const createDefaultFlow = async () => {
    const { data: profile } = await supabase.auth.getUser()
    const userId = profile.user?.id

    const { data: flow, error: flowError } = await supabase
      .from('flows')
      .insert([{ title: 'Master Flow', status: 'active', created_by: userId }])
      .select()
      .single()

    if (flowError) {
      toast.error('Failed to initialize master flow')
      return
    }

    const defaultColumns = ['To Do', 'In Progress', 'In Review', 'Done']
    const columnInserts = defaultColumns.map((title, index) => ({
      flow_id: flow.id,
      title,
      position: index
    }))

    await supabase.from('flow_columns').insert(columnInserts)
    fetchFlowData()
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result
    if (!destination) return

    const { error } = await supabase
      .from('tasks')
      .update({ 
        column_id: destination.droppableId,
        updated_at: new Date().toISOString()
      })
      .eq('id', draggableId)

    if (error) {
      toast.error('Failed to update task position')
      fetchFlowData() // Revert
    }
  }

  const openTask = (id: string) => {
    setSelectedTaskId(id)
    setIsModalOpen(true)
  }

  const filteredTasksList = data ? Object.values(data.tasks).filter((task: any) => 
    task.title.toLowerCase().includes(search.toLowerCase())
  ) : []

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg text-white">
            <Workflow className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workflows</h1>
            <p className="text-slate-500 text-sm">Organize projects and track team progress.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <Button 
            variant={view === 'board' ? 'white' : 'ghost'} 
            size="sm" 
            className="h-8 gap-2 shadow-sm"
            onClick={() => setView('board')}
          >
            <Kanban className="h-4 w-4" /> Board
          </Button>
          <Button 
            variant={view === 'table' ? 'white' : 'ghost'} 
            size="sm" 
            className="h-8 gap-2 shadow-sm"
            onClick={() => setView('table')}
          >
            <TableIcon className="h-4 w-4" /> Table
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 h-10 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-10">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button style={{ backgroundColor: brandColor }} className="gap-2 h-10 text-white">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
              <p className="text-sm text-slate-500 font-medium">Loading workspace...</p>
            </div>
          </div>
        ) : data ? (
          view === 'board' ? (
            <KanbanBoard 
              initialData={data} 
              onDragEnd={handleDragEnd} 
              onTaskClick={openTask} 
            />
          ) : (
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="w-[400px]">Task Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasksList.map((task: any) => (
                    <TableRow 
                      key={task.id} 
                      className="group cursor-pointer hover:bg-slate-50"
                      onClick={() => openTask(task.id)}
                    >
                      <TableCell className="font-medium text-slate-900">
                        {task.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-none capitalize">
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "capitalize border-none",
                            task.priority === 'urgent' && "bg-red-100 text-red-700",
                            task.priority === 'high' && "bg-orange-100 text-orange-700",
                            task.priority === 'medium' && "bg-blue-100 text-blue-700",
                            task.priority === 'low' && "bg-slate-100 text-slate-700",
                          )}
                        >
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed rounded-xl">
            <Layout className="h-12 w-12 mb-4 text-slate-200" />
            <p className="text-lg font-medium">No flows found</p>
            <Button variant="outline" className="mt-4" onClick={createDefaultFlow}>
              Initialize Master Flow
            </Button>
          </div>
        )}
      </div>

      <TaskModal 
        taskId={selectedTaskId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={fetchFlowData}
      />
    </div>
  )
}
