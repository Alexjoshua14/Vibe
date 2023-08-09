
import React from 'react';

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

const ref = React.createRef<HTMLDivElement>();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className="overscroll-none">

      <body className={`inter.className z-10 bg-gradient-to-t from-purple-700 to-teal-500`}>
        <div className={`flex flex-col min-h-screen p-2 z-20`}>
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
