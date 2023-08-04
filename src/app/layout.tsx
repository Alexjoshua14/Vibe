
import { BottomNav } from '../components/bottomNav';
import AuthProvider from './context/AuthProvider';

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vibe',
  description: 'Social Music Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <div className="flex flex-col min-h-screen p-2 bg-gradient-to-tr from-purple-900 to-teal-500">
          <div className="flex-1 flex pb-[5rem]">
            <AuthProvider>
              {children}
            </AuthProvider>
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
