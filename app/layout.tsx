import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Editify - AI Image Editor',
  description: 'Editify is a Gemini Image Editor with Google Gemini 2.0 Flash Exp Image Generation model and Next.js 14. Upload your images and transform them with AI-powered editing.',
  generator: 'Mohammed Shafi',
  keywords: ['image editor', 'AI', 'Gemini', 'Google AI', 'image generation', 'photo editing', 'Next.js'],
  authors: [{ name: 'Mohammed Shafi' }],
  creator: 'Mohammed Shafi',
  publisher: 'Editify',
  applicationName: 'Editify Image Editor',
  metadataBase: new URL('https://editify-gemini.vercel.app/'),
  openGraph: {
    title: 'Editify - AI Image Editor',
    description: 'Transform your images with Google Gemini 2.0 AI technology',
    url: 'https://editify-gemini.vercel.app/',
    siteName: 'Editify',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Editify - AI Image Editor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editify - AI Image Editor',
    description: 'Transform your images with Google Gemini 2.0 AI technology',
    images: ['/opengraph-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
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
