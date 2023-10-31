"use client"

import React from "react"
import Grid from "@mui/material/Unstable_Grid2"

import { FeedButton, PlayerButton, ProfileButton } from "./buttons"

export const BottomNav = () => {
  return (
    <Grid
      container
      spacing={2}
      className="fixed bottom-0 left-0 right-0 flex center h-14 sm:h-20 p-1 sm:p-4 text-center bg-zinc-800 glassmorphism glassmorphism-2"
    >
      <Grid xs={4}>
        <FeedButton />
      </Grid>
      <Grid xs={4}>
        <PlayerButton />
      </Grid>
      <Grid xs={4}>
        <ProfileButton />
      </Grid>
    </Grid>
  )
}
