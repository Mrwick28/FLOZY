'use client'

import React, { useEffect, useState } from 'react'
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
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Save, 
  Loader2,
  Calendar as CalendarIcon,
  DollarSign,
  User,
  Hash
} from 'lucide-react'
import Link from 'next/link'
import { useBranding } from '@/components/providers/BrandingProvider'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Client {
  id: string
  company: string
  name: string
}

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const supabase = createClient()
  const { brandColor } = useBranding()
  
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [fetchingClients, setFetchingClients] = useState(true)
  
  const [formData, setFormData] = useState({
    client_id: '',
    invoice_number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    issue_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    currency: 'USD',
    notes: '',
  })

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, amount: 0 }
  ])

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setFetchingClients(true)
    const { data, error } = await supabase
      .from('clients')
      .select('id, company, name')
      .order('company', { ascending: true })

    if (error) {
      toast.error('Failed to load clients')
    } else {
      setClients(data || [])
    }
    setFetchingClients(false)
  }

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, amount: 0 }
    ])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return
    setLineItems(lineItems.filter(item => item.id !== id))
  }

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates }
        updated.amount = updated.quantity * updated.rate
        return updated
      }
      return item
    }))
  }

  const subtotal = lineItems.reduce((acc, item) => acc + item.amount, 0)
  const tax = subtotal * 0 // Placeholder for tax logic
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.client_id) {
      toast.error('Please select a client')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('invoices')
      .insert([
        {
          ...formData,
          line_items: lineItems,
          subtotal,
          tax_total: tax,
          total,
          status: 'draft',
        }
      ])

    if (error) {
      toast.error(error.message || 'Failed to create invoice')
    } else {
      toast.success('Invoice created successfully')
      router.push('/dashboard/invoices')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link 
        href="/dashboard/invoices" 
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Invoices
      </Link>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Invoice</h1>
          <p className="text-slate-500">Generate a new bill for your client.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <select
                      id="client"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      value={formData.client_id}
                      onChange={e => setFormData({...formData, client_id: e.target.value})}
                    >
                      <option value="">Select a client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.company} ({client.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice_number">Invoice #</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="invoice_number" 
                      required 
                      className="pl-9"
                      value={formData.invoice_number}
                      onChange={e => setFormData({...formData, invoice_number: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="issue_date" 
                      type="date" 
                      required 
                      className="pl-9"
                      value={formData.issue_date}
                      onChange={e => setFormData({...formData, issue_date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="due_date" 
                      type="date" 
                      required 
                      className="pl-9"
                      value={formData.due_date}
                      onChange={e => setFormData({...formData, due_date: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Items</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addLineItem}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div key={item.id} className="flex gap-4 items-start group">
                      <div className="flex-1 space-y-2">
                        <Input 
                          placeholder="Item description" 
                          value={item.description}
                          onChange={e => updateLineItem(item.id, { description: e.target.value })}
                        />
                      </div>
                      <div className="w-24 space-y-2">
                        <Input 
                          type="number" 
                          placeholder="Qty" 
                          value={item.quantity}
                          onChange={e => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-3 h-4 w-4 text-slate-400" />
                          <Input 
                            type="number" 
                            className="pl-7"
                            placeholder="Rate" 
                            value={item.rate}
                            onChange={e => updateLineItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div className="w-32 py-2 text-right font-medium text-slate-900">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: formData.currency
                        }).format(item.amount)}
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeLineItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Thank you for your business!"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: formData.currency }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-4 border-t flex justify-between font-bold text-lg text-slate-900">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: formData.currency }).format(total)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full gap-2 py-6 text-lg"
                  style={{ backgroundColor: brandColor }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Create Invoice
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm appearance-none"
                    value={formData.currency}
                    onChange={e => setFormData({...formData, currency: e.target.value})}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AED">AED - UAE Dirham</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
