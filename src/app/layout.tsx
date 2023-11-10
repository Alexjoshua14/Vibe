import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import Providers from "@/components/Providers"
import { Toaster } from "@/components/ui/toaster"

import { BottomNav } from "../components/bottomNav"
import Player from "../components/player"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vibe",
  description: "Social Music Application",
}

const ref = React.createRef<HTMLDivElement>()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overscroll-none">
      <Providers>
        <body className={`inter.className z-10 bg-primary text-primary`}>
          <div className={`flex flex-col min-h-screen p-2 z-20`}>
            <div className="flex-1 flex pb-[5rem]">
              {children}
            </div>
            <Toaster />
            <Player />
            <BottomNav />
          </div>
        </body>
      </Providers>
    </html>
  )
}
