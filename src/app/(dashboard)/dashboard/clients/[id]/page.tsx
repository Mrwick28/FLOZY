'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  ChevronLeft, 
  Trash2, 
  Save, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Globe,
  Loader2,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { useBranding } from '@/components/providers/BrandingProvider'
import { toast } from 'sonner'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ClientData {
  id: string
  name: string
  company: string
  email: string
  phone: string | null
  portal_slug: string
  internal_notes: string | null
  status: string
  created_at: string
}

export default function ClientDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const supabase = createClient()
  const { brandColor } = useBranding()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [client, setClient] = useState<ClientData | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    portal_slug: '',
    internal_notes: '',
    status: 'active'
  })

  useEffect(() => {
    if (id) {
      fetchClient()
    }
  }, [id])

  const fetchClient = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      toast.error('Failed to load client details')
      router.push('/dashboard/clients')
    } else {
      setClient(data)
      setFormData({
        name: data.name || '',
        company: data.company || '',
        email: data.email || '',
        phone: data.phone || '',
        portal_slug: data.portal_slug || '',
        internal_notes: data.internal_notes || '',
        status: data.status || 'active'
      })
    }
    setLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('clients')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      toast.error(error.message || 'Failed to update client')
    } else {
      toast.success('Client updated successfully')
      fetchClient()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error(error.message || 'Failed to delete client')
      setDeleting(false)
    } else {
      toast.success('Client deleted successfully')
      router.push('/dashboard/clients')
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!client) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/clients" 
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{client.company}</h1>
            <p className="text-slate-500 flex items-center gap-2">
              <User className="h-4 w-4" />
              Primary Contact: {client.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/portal/${client.portal_slug}`} target="_blank">
              <Globe className="mr-2 h-4 w-4" />
              View Portal
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the client
                  <strong> {client.company} </strong> and all associated data, including invoices and flows.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Client'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-6">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-6 py-3"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="invoices" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-6 py-3"
          >
            Invoices
          </TabsTrigger>
          <TabsTrigger 
            value="tasks" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-6 py-3"
          >
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <form onSubmit={handleUpdate}>
                <Card>
                  <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                    <CardDescription>Update the primary contact and company details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Contact Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input 
                            id="name" 
                            required 
                            className="pl-9"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input 
                            id="company" 
                            required 
                            className="pl-9"
                            value={formData.company}
                            onChange={e => setFormData({...formData, company: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input 
                            id="email" 
                            type="email" 
                            required 
                            className="pl-9"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input 
                            id="phone" 
                            className="pl-9"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Portal Slug</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 rounded-md bg-slate-100 text-slate-500 text-sm border">
                          portal/
                        </div>
                        <Input 
                          id="slug" 
                          value={formData.portal_slug}
                          onChange={e => setFormData({...formData, portal_slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Internal Notes</Label>
                      <ValueContent value={formData.internal_notes || ''}>
                        <Textarea 
                          id="notes" 
                          value={formData.internal_notes}
                          onChange={e => setFormData({...formData, internal_notes: e.target.value})}
                          className="min-h-[120px]"
                        />
                      </ValueContent>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t bg-slate-50/50 p-6">
                    <Button 
                      type="submit" 
                      disabled={saving}
                      style={{ backgroundColor: brandColor }}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 text-blue-700">
                    <span className="text-sm font-medium">Active Tasks</span>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 text-green-700">
                    <span className="text-sm font-medium">Paid Invoices</span>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 text-amber-700">
                    <span className="text-sm font-medium">Pending Payments</span>
                    <span className="text-2xl font-bold">$0.00</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-100 bg-red-50/30">
                <CardHeader>
                  <CardTitle className="text-red-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-red-700/70">
                    Once you delete a client, there is no going back. Please be certain.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Delete This Client
                      </Button>
                    </AlertDialogTrigger>
                    {/* Reuse Alert Dialog from top for consistency or move to separate component */}
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Manage billing for {client.company}.</CardDescription>
              </div>
              <Button style={{ backgroundColor: brandColor }}>
                Create Invoice
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <p>No invoices found for this client.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tasks & Projects</CardTitle>
                <CardDescription>View current flows and tasks associated with this client.</CardDescription>
              </div>
              <Button style={{ backgroundColor: brandColor }}>
                Assign Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <p>No active tasks found for this client.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ValueContent({ children, value }: { children: React.ReactNode, value: string }) {
  return (
    <div className="space-y-2">
      {children}
    </div>
  )
}
