import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Workflow, 
  Users, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 h-20 flex items-center justify-between border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            F
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">FLOZY</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Resources</a>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6" asChild>
            <Link href="/dashboard" className="gap-2">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
          </div>
          
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">
              <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
              The All-in-One Agency OS
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Scale your agency with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                absolute precision.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-500 leading-relaxed">
              Manage clients, automate billing, and track workflows in one unified platform. Built for modern agencies who move fast.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 bg-slate-900 text-white hover:bg-slate-800 rounded-full text-lg font-semibold shadow-xl shadow-slate-200" asChild>
                <Link href="/dashboard">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg font-semibold group" asChild>
                <Link href="#features">
                  Watch Demo
                  <Zap className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
            </div>
            
            {/* Social Proof / Trust */}
            <div className="pt-20">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-8">Trusted by 500+ high-growth agencies</p>
              <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale pointer-events-none">
                {/* Mock logos */}
                <span className="text-2xl font-bold italic">TechFlow</span>
                <span className="text-2xl font-bold">DIGITALIZ</span>
                <span className="text-2xl font-bold uppercase">Nexus</span>
                <span className="text-2xl font-bold">Vertex</span>
                <span className="text-2xl font-bold font-serif">Aura</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl font-bold text-slate-900">Everything you need to grow</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto italic">
                "We built Flozy because spreadsheets and basic CRMs weren't designed for the speed of modern agencies."
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Client Portals</h3>
                <p className="text-slate-500">Professional, white-labeled portals for your clients to view progress, pay invoices, and chat.</p>
              </div>
              
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-6">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Invoicing</h3>
                <p className="text-slate-500">Generate professional invoices in seconds, track payments, and setup recurring billing effortlessly.</p>
              </div>
              
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-6">
                  <Workflow className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Unified Workflows</h3>
                <p className="text-slate-500">Track tasks and projects across all clients with our intuitive Kanban boards and flow systems.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Zap className="h-32 w-32 text-white/5" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to elevate your agency?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of agency owners who have unified their data and reclaimed their time.
            </p>
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-12 h-14 text-lg font-bold" asChild>
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Secure Auth</span>
              <span className="flex items-center gap-1"><BarChart3 className="h-4 w-4" /> No CC Required</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="font-bold">FLOZY</span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2026 Flozy Agency OS. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
