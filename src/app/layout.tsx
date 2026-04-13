import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BrandingProvider } from "@/components/providers/BrandingProvider";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agency Manager",
  description: "Internal Agency Operations Hub",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.JSX.Element> {
  const supabase = await createClient();
  
  // Fetch agency settings
  const { data: settings } = await (supabase
    .from('agency_settings')
    .select('*')
    .single() as any);

  const brandColor = settings?.brand_color || '#3b82f6';
  const agencyName = settings?.agency_name || 'Agency Manager';
  const logoUrl = settings?.logo_url || null;

  const brandingInitial = {
    brandColor,
    agencyName,
    logoUrl,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <BrandingProvider initialSettings={brandingInitial}>
          {children}
          <Toaster position="top-right" />
        </BrandingProvider>
      </body>
    </html>
  );
}
