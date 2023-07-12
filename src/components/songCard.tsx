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
import { Modal } from '@mui/material';

/**
 * Creates a feature card for a song with a progress bar
 * 
 * @param song The song to create a card for
 * @param progress The progress of the song 
 */
export const SongCard = ({ song, progress_ms }: { song: SpotifyItem, progress_ms?: number }) => {
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
            {progress_ms &&
              <div className="w-full">
                <LinearProgress variant="determinate" value={progressToPercentage(progress_ms, song.duration_ms)} />
                <Typography component="div" variant="subtitle2">
                  {msToTime(progress_ms)} / {msToTime(song.duration_ms)}
                </Typography>
              </div>
            }
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
      className={`rounded-lg w-[300px] md:w-[400px] pe-4 
                  bg-gray-600 bg-opacity-20 backdrop-blur-xl 
                  text-white overflow-hidden cursor-pointer`}
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
        <div className="flex flex-col w-full p-4 max-w-[200px] md:max-w-[300px]">
          <div className="flex flex-col justify-between items-start">
            <p className="text-md whitespace-nowrap overflow-x-auto no-scrollbar max-w-full">
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


export const AddToQueueModal = ({ item, open, addToQueue, cancelAddToQueue }:
  {
    item: SpotifyItem | null,
    open: boolean,
    addToQueue: () => any,
    cancelAddToQueue: () => void,
  }) => {
  return (
    <Modal
      open={open}
      onClose={cancelAddToQueue}
    >
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] 
                      w-[80%] h-2/3 md:w-[500px] md:h-96 rounded-lg
                      flex flex-col items-center justify-center
                      backdrop-filter backdrop-blur-lg"
      >
        <div className="flex flex-col justify-center items-center w-fit gap-4">
          <div className="rounded-lg overflow-hidden">
            <Image
              src={item?.album.images[0].url ?? ""}
              height={140}
              width={140}
              alt={item?.album.name ?? ""}
            />
          </div>
          <div className="flex flex-col justify-between items-center">
            <p className="text-md whitespace-nowrap overflow-x-auto no-scrollbar max-w-full">
              {item?.name}
            </p>
            <div className="flex text-xs gap-2 text-gray-300 items-center">
              {<BsFillExplicitFill />}
              <div className="flex gap-1">
                <p>
                  {item ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : ""}
                </p>
                <p>
                  •
                </p>
                <p>
                  {item?.artists[0].name ?? ""}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center gap-2 md:gap-4">
          <button onClick={addToQueue()} className="px-3 py-1 bg-green-500 bg-opacity-60 rounded-lg">
            Add to Queue
          </button>
          <button onClick={cancelAddToQueue} className="px-3 py-1 bg-red-500 bg-opacity-50 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}