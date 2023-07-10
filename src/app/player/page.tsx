'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import useSWR from 'swr';

import Image from 'next/image';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { SongCard } from '../../components/songCard';
import { songs } from '../../data/songs';

const fetcher = (url) => fetch(url).then((res) => res.json());

const url = 'https://api.spotify.com/v1/me/player/currently-playing'


export default function Player() {
  const { data: session, status } = useSession({
    required: true,
    // onUnauthenticated() {
    //   redirect('/api/auth/signin?callbackUrl=/player');
    // } 
  });

  if (session) {
    const currentlyPlaying = fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
     });
     console.log(`Currently Playing: ${currentlyPlaying}`);
  }
  // const { data, error, isLoading } = useSWR(url, fetcher);

  // const { data: session } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect('/api/auth/signin?callbackUrl=/');
  //   }
  // });
  
  console.log(session)

  // if (status === "authenticated") {
    return (
      <main className="flex-1 p-16 flex flex-col items-center justify-between border-2 border-orange-500">
        <Grid container spacing={8} className="p-4 border-2 border-yellow-500">
          <Grid xs={12} className="border-2 border-teal-500">
            <h1 className="text-6xl font-bold text-center">Hello World</h1>
          </Grid>
          <Grid container xs={12} justifyContent="center" alignItems="center" spacing={4} className="border-2 border-pink-500">
            <Grid xs={12} className="flex justify-center items-center border-2 border-green-500">
              <SongCard song={songs[6]} />
            </Grid>
            <Grid xs={12} justifyContent="center" className="text-center border-2 border-blue-500">
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField 
                  id="searchMusic" 
                  label="Add to Queue" 
                  variant="outlined" 
                  sx={{input: {color: 'pink'}}} 
                  InputLabelProps={{ style: {color: "gray"}}} 
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </main>
    )
  // } else {
  //   return (
  //     <div>
  //       Please log in to view this page
  //     </div>

  //   )
  // }
}
