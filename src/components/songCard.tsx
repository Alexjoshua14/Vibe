'use client'

import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { SpotifyItem } from '../types/spotifyTypes';

export const SongCard = ({ song, progress }: { song: SpotifyItem, progress?: number } ) => {
  return (
    <Card sx={{ display: 'flex'}} className={`rounded-lg min-w-[400px] pe-4 max-w-[38rem] bg-gradient-to-tr from-gray-800 to-gray-600 bg-opacity-40 backdrop-blur-lg text-white`}>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <CardMedia
          component="img"
          sx={{ width: 140 }}
          image={song.album.images[0].url}
          alt={song.album.name}
          />
        <Box sx={{display: 'flex', flexDirection: 'col', width: '100%'}}>
          <CardContent sx={{ flex: '1 0 auto' }} className="flex flex-col justify-between">
            <div className="flex-1">
              <Typography component="div" variant="h5">
                {song.name}
              </Typography>
              <Typography component="div" variant="subtitle1">
                {song.artists[0].name}
              </Typography>
            </div>
            <div className="w-full">
              <LinearProgress variant="determinate" value={progress} />
            </div>
          </CardContent>  
        </Box>
      </Box>
    </Card>
  )

}