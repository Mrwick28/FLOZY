'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface BrandingContextType {
  brandColor: string
  agencyName: string
  logoUrl: string | null
}

const BrandingContext = createContext<BrandingContextType>({
  brandColor: '#3b82f6',
  agencyName: 'Agency Manager',
  logoUrl: null,
})

export const useBranding = (): BrandingContextType => {
  const context = useContext(BrandingContext)
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider')
  }
  return context
}

export const BrandingProvider = ({
  children,
  initialSettings,
}: {
  children: React.ReactNode
  initialSettings: BrandingContextType
}) => {
  const [settings] = useState(initialSettings)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary', settings.brandColor)
    }
  }, [settings.brandColor])

  return (
    <BrandingContext value={settings}>
      {children}
    </BrandingContext>
  )
}
