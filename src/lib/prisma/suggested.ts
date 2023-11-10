
import { getSong } from "@/utilities/spotifyAPI"

import prisma from "../prisma"

export async function getSuggested(suggestedId: string) {
  return await prisma.suggested.findFirst({
    where: {
      id: suggestedId
    }
  })
}

export async function addSongToSuggested(suggestedId: string, songId: string) {
  const songSpotify = await getSong(songId.toString())

  const existingSuggested = await prisma.suggested.findFirst({ where: { id: suggestedId}, select: { songs: true}})
  // const song = await prisma.song.upsert({
  //   where: {
  //     id: songId
  //   }, create: {
      
  //   }, update: {}
  // })

  // const modifiedSuggestedSongs = existingSuggested ? [...existingSuggested.songs,  ] : []

  
  // return await prisma.suggested.upsert({
  //   where: {
  //     id: suggestedId
  //   },
  //   create: {

  //   },
  //   update: {
  //     songs: 
  //   }
  // })
}