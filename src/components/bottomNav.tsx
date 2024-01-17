"use client"

import React from "react"
import Grid from "@mui/material/Unstable_Grid2"

import { PlayerButton, ProfileButton } from "./buttons/NavigationButtons"

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 h-14 sm:h-20 px-2 py-1 text-center glassmorphism-primary rounded">
      <ul className="w-full h-full flex gap-2 items-center justify-around">
        <li>
          <PlayerButton className="glassmorphism-secondary-interactive bg-primary px-6 py-3 rounded hover:scale-110 transiton-all subpixel-antialiased" />
        </li>
        <li>
          <ProfileButton className="glassmorphism-secondary-interactive bg-primary px-6 py-3 rounded hover:scale-110 transiton-all subpixel-antialiased" />
        </li>
      </ul>
    </nav>
  )
}
