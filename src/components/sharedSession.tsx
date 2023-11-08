'use client'

import { FC } from 'react'
import { useSelector } from 'react-redux'

import { getUser } from '@/lib/prisma/user'
import { Context } from '@/lib/validators/context'

import Search from './search/search'
import CurrentlyPlaying from './currentlyPlaying'
import { LeaveSession } from './sessionButtons'
import SongCarousel from './songCarousel'

interface sharedSessionProps {

}

const SharedSession: FC<sharedSessionProps> = ({ }) => {
  const currentlyPlaying = useSelector((state: Context) => state.currentlyPlaying)
  const status = useSelector((state: Context) => state.status)
  const host = currentlyPlaying?.userId ? getUser(currentlyPlaying.userId).then((user) => user) : null

  if (status === 'HOST') {
    return (
      <div className="w-full h-full">
        <h1>Host</h1>
        <div className="w-full h-full grid grid-cols-2 grid-rows-1 items-center">
          <div className="h-full col-span-1 p-20 flex items-center justify-center">
            <CurrentlyPlaying />
          </div>
          <div className="h-3/5 col-span-1 flex flex-col gap-8">
            <div className="w-full h-1/2 flex items-center justify-end">
              <SongCarousel header="Queue" />
            </div>
            <div className="w-full h-1/2 flex items-center justify-end">
              <SongCarousel header="Suggested" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Member</h1>
      <div className="h-[400px] flex flex-col items-center justify-center">
        <CurrentlyPlaying />
      </div>
      <Search />
      <LeaveSession />
    </div>
  )
}

export default SharedSession