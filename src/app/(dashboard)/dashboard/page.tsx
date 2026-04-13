export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, Admin</h1>
        <p className="text-slate-500">Here's what's happening with your agency today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Quick Stats Placeholder */}
        {[
          { label: 'Active Clients', value: '12', trend: '+2' },
          { label: 'Pending Invoices', value: '$4,250', trend: '3' },
          { label: 'Open Tasks', value: '24', trend: '-5' },
          { label: 'New Leads', value: '7', trend: '+4' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full",
                stat.trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              )}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-white p-6 shadow-sm h-[400px] flex items-center justify-center text-slate-400 italic">
          Revenue Chart coming soon...
        </div>
        <div className="col-span-3 rounded-xl border bg-white p-6 shadow-sm h-[400px] flex items-center justify-center text-slate-400 italic">
          Recent Activity coming soon...
        </div>
      </div>
    </div>
  )
}

import { cn } from '@/lib/utils'
