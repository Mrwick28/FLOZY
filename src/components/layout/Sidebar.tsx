'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Kanban, 
  Target, 
  MessageSquare, 
  Brain, 
  FolderRoot,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useBranding } from '@/components/providers/BrandingProvider'
import Image from 'next/image'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Flows', href: '/dashboard/flows', icon: Kanban },
  { name: 'Leads', href: '/dashboard/leads', icon: Target },
  { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Brain', href: '/dashboard/brain', icon: Brain },
  { name: 'Documents', href: '/dashboard/documents', icon: FolderRoot },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const { brandColor, agencyName, logoUrl } = useBranding()

  return (
    <div 
      className={cn(
        "relative flex flex-col border-r bg-white transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4 overflow-hidden">
        {logoUrl ? (
          <div className={cn("relative h-8 w-full transition-all", collapsed ? "opacity-0" : "opacity-100")}>
            <Image 
              src={logoUrl} 
              alt={agencyName} 
              fill 
              style={{ objectFit: 'contain', objectPosition: 'left' }} 
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div 
              className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-lg text-white font-bold"
              style={{ backgroundColor: brandColor }}
            >
              {agencyName.charAt(0)}
            </div>
            {!collapsed && (
              <span className="font-bold text-lg truncate">{agencyName}</span>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                isActive 
                  ? "text-white" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
              style={isActive ? { backgroundColor: brandColor } : {}}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
              {collapsed && !isActive && (
                <div className="absolute left-full ml-2 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-3 space-y-2">
        <Link
          href="/dashboard/settings"
          className={cn(
            "group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            pathname === '/dashboard/settings' && "bg-slate-100 text-slate-900"
          )}
        >
          <Settings className={cn("h-5 w-5 shrink-0", collapsed ? "mx-auto" : "mr-3")} />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          className="w-full group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          onClick={() => {/* TODO: Sign out */}}
        >
          <LogOut className={cn("h-5 w-5 shrink-0", collapsed ? "mx-auto" : "mr-3")} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-sm hover:bg-slate-50 transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </div>
  )
}
