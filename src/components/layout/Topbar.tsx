'use client'

import React from 'react'
import { Bell, Search, Plus, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBranding } from '@/components/providers/BrandingProvider'

export function Topbar() {
  const { brandColor } = useBranding()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex flex-1 items-center max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search everything..."
            className="pl-9 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          size="sm" 
          className="hidden md:flex gap-2"
          style={{ backgroundColor: brandColor }}
        >
          <Plus className="h-4 w-4" />
          Create New
        </Button>

        <Button variant="ghost" size="icon" className="relative text-slate-500">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900 group-hover:text-slate-600 transition-colors">Admin User</p>
            <p className="text-xs text-slate-500 leading-none">admin@agency.com</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <User className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  )
}
