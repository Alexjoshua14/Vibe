'use client'

import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { Song } from '../types/index';

interface SongCardProps {
  song: Song;
}



export const SongCard = ({ song }: SongCardProps ) => {
  return (
    <Card sx={{ display: 'flex'}} className="rounded-lg h-36 min-w-[20rem] max-w-[30rem] bg-gradient-to-tr from-gray-800 to-gray-600 bg-opacity-40 backdrop-blur-lg text-white">
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <CardMedia
          component="img"
          sx={{ width: 100 }}
          image="https://images.unsplash.com/photo-1688398658165-9f404b8617d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
          alt="Album cover"
          />
        <Box sx={{display: 'flex', flexDirection: 'col', width: '100%'}}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5">
              {song.title}
            </Typography>
            <Typography component="div" variant="subtitle1">
              {song.artist}
            </Typography>
          </CardContent>
          <LinearProgress variant="determinate" value={.14} className="border-2 border-green-500" />
        </Box>
      </Box>
    </Card>
  )

}