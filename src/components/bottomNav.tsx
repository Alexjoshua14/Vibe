'use client'

import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import { FeedButton, PlayerButton, ProfileButton } from './buttons';

export const BottomNav = () => {
  return (
    <Grid container spacing={2} className="fixed bottom-0 left-0 right-0 p-4 text-center bg-zinc-800 h-20 bg-opacity-50 backdrop-blur-lg">
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