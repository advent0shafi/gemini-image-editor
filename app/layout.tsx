import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Editify',
  description: 'Editify is a Gemini Image Editor with Google Gemini 2.0 Flash Exp Image Generation model and Next.js 14 ',
  generator: 'Mohammed Shafi',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}
      <Analytics />
      </body>
    </html>
  )
}
