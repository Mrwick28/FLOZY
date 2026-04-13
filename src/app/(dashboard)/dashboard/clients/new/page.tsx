'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useBranding } from '@/components/providers/BrandingProvider'
import { toast } from 'sonner'

export default function NewClientPage() {
  const router = useRouter()
  const supabase = createClient()
  const { brandColor } = useBranding()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    portal_slug: '',
    internal_notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Auto-generate slug if empty
    const slug = formData.portal_slug || formData.company.toLowerCase().replace(/\s+/g, '-')

    const { error } = await supabase
      .from('clients')
      .insert([
        { 
          ...formData, 
          portal_slug: slug,
          status: 'active' 
        }
      ])

    if (error) {
      toast.error(error.message || 'Failed to create client')
    } else {
      toast.success('Client created successfully')
      router.push('/dashboard/clients')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link 
        href="/dashboard/clients" 
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Clients
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Client</h1>
        <p className="text-slate-500">Create a new client profile and their dedicated portal.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Enter the primary contact and company details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Name</Label>
                <Input 
                  id="name" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input 
                  id="company" 
                  required 
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  placeholder="Acme Inc." 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Portal Slug (e.g., flow.agency/portal/acme)</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 rounded-md bg-slate-100 text-slate-500 text-sm border">
                  portal/
                </div>
                <Input 
                  id="slug" 
                  value={formData.portal_slug}
                  onChange={e => setFormData({...formData, portal_slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  placeholder="acme-inc" 
                />
              </div>
              <p className="text-xs text-slate-400">Leave blank to auto-generate from company name.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea 
                id="notes" 
                value={formData.internal_notes}
                onChange={e => setFormData({...formData, internal_notes: e.target.value})}
                placeholder="Any private details about this client..." 
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t bg-slate-50/50 p-6">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/clients">Cancel</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              style={{ backgroundColor: brandColor }}
            >
              {loading ? 'Creating...' : 'Create Client'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
