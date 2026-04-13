'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useBranding } from '@/components/providers/BrandingProvider'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { brandColor, agencyName, logoUrl } = useBranding()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Logged in successfully')
      
      const { data: profile } = await (supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single() as any)

      if (profile?.role === 'client') {
        router.push('/portal')
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          {logoUrl ? (
            <div className="mx-auto mb-4 relative h-12 w-32">
              <Image 
                src={logoUrl} 
                alt={agencyName} 
                fill 
                style={{ objectFit: 'contain' }} 
                priority
              />
            </div>
          ) : (
            <div 
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-white font-bold text-xl"
              style={{ backgroundColor: brandColor }}
            >
              {agencyName.charAt(0)}
            </div>
          )}
          <CardTitle className="text-2xl">{agencyName}</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full" 
              type="submit" 
              disabled={isLoading}
              style={{ backgroundColor: brandColor }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-center text-sm text-slate-500">
              Forgot your password? Contact your administrator.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
