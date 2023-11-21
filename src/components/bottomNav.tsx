"use client"

import React from "react"
import Grid from "@mui/material/Unstable_Grid2"

import { FeedButton, PlayerButton, ProfileButton } from "./buttons"

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 h-14 sm:h-20 p-1 sm:p-4 text-center bg-secondary glassmorphism-tertiary rounded">
      <ul className="w-full h-full flex gap-2 items-center justify-around">
        <li className="glassmorphism-tertiary-interactive px-6 py-3 rounded hover:scale-105 subpixel-antialiased transiton-all">
          <PlayerButton />
        </li>
        <li className="glassmorphism-tertiary-interactive px-6 py-3 rounded hover:scale-105 transiton-all subpixel-antialiased">
          <ProfileButton />
        </li>
      </ul>
    </nav>
  )
}
