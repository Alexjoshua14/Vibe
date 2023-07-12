'use client'

import React from 'react';

import Image from 'next/image';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BsFillExplicitFill } from 'react-icons/bs';

import { msToTime, progressToPercentage } from '@/utilities/helper';

import { SpotifyItem } from '../types/spotifyTypes';

/**
 * Creates a feature card for a song with a progress bar
 * 
 * @param song The song to create a card for
 * @param progress The progress of the song 
 */
export const SongCard = ({ song, progress_ms }: { song: SpotifyItem, progress_ms: number }) => {
  return (
    <Card sx={{ display: 'flex' }} className={`rounded-lg min-w-[400px] pe-4 max-w-[38rem] bg-gradient-to-tr from-gray-800 to-gray-600 bg-opacity-40 backdrop-blur-lg text-white`}>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <CardMedia
          component="img"
          sx={{ width: 140 }}
          image={song.album.images[0].url}
          alt={song.album.name}
        />
        <Box sx={{ display: 'flex', flexDirection: 'col', width: '100%' }}>
          <CardContent sx={{ flex: '1 0 auto' }} className="flex flex-col justify-between max-w-full">
            <div className="flex-1">
              <Typography component="div" variant="h5">
                {song.name}
              </Typography>
              <Typography component="div" variant="subtitle1">
                {song.artists[0].name}
              </Typography>
            </div>
            <div className="w-full">
              <LinearProgress variant="determinate" value={progressToPercentage(progress_ms, song.duration_ms)} />
              <Typography component="div" variant="subtitle2">
                {msToTime(progress_ms)} / {msToTime(song.duration_ms)}
              </Typography>

            </div>
          </CardContent>
        </Box>
      </Box>
    </Card>
  )
}

/**
 * Creates a simple card to display a Spotify Item's information
 * 
 * @param item The item to create a search card for
 */
export const SearchResult = ({ item }: { item: SpotifyItem }) => {
  return (
    <div
      className={`rounded-lg w-[400px] pe-4 
                  bg-gray-600 bg-opacity-20 backdrop-blur-xl 
                  text-white overflow-hidden cursor-pointer`}
      onClick={() => console.log(item.id)}
    >
      <div className="flex w-full">
        <div className="flex justify-center items-center p-2">
          <Image
            src={item.album.images[0].url}
            height={60}
            width={60}
            alt={item.album.name}
          />
        </div>
        <div className="flex flex-col w-full p-4">
          <div className="flex flex-col justify-between">
            <p className="text-md">
              {item.name}
            </p>
            <div className="flex text-xs gap-2 text-gray-300 items-center">
              {<BsFillExplicitFill />}
              <div className="flex gap-1">
                <p>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </p>
                <p>
                  •
                </p>
                <p>
                  {item.artists[0].name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}