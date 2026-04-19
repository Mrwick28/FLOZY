import { RevenueChart } from "@/components/charts/RevenueChart"
import { ProjectPieChart } from "@/components/charts/ProjectPieChart"
import { 
  Users, 
  CreditCard, 
  Activity, 
  ArrowUpRight, 
  Workflow, 
  FileText, 
  Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Command Center</h1>
        <p className="text-lg text-slate-500">Welcome back. Here is your agency at a glance.</p>
      </div>

      {/* Quick Action Dock - Notion Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/flows" className="group">
          <Card className="hover:border-slate-400 transition-all cursor-pointer bg-white shadow-none">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Workflow className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 leading-tight">Workflows</p>
                <p className="text-xs text-slate-500">Projects & Tasks</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/invoices" className="group">
          <Card className="hover:border-slate-400 transition-all cursor-pointer bg-white shadow-none">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 leading-tight">Invoices</p>
                <p className="text-xs text-slate-500">Billing & Revenue</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/leads" className="group">
          <Card className="hover:border-slate-400 transition-all cursor-pointer bg-white shadow-none">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 leading-tight">Sales Pipeline</p>
                <p className="text-xs text-slate-500">Leads & Deals</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 h-full">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3 h-full">
          <ProjectPieChart />
        </div>
      </div>

      {/* Secondary Row: Stats & Lists */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-none border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Task completed</p>
                  <p className="text-xs text-slate-500">Design overhaul for Acme Inc</p>
                </div>
                <span className="text-[10px] text-slate-400">2h ago</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between" asChild>
              <Link href="/dashboard/settings">
                Agency Settings <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-between" asChild>
              <Link href="/dashboard/clients">
                Client Directory <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-between">
              Join Discord Community <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-none border-slate-200 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Agency Pro</CardTitle>
            <CardDescription className="text-slate-400">You are currently using the private agency version.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>Storage</span>
                <span>4.2GB / 10GB</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[42%]" />
              </div>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold">
                Check Usage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
