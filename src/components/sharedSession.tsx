'use client'

import { FC, Suspense } from 'react'
import { useSelector } from 'react-redux'

import { useSessionManagement } from '@/app/hooks/useSessionManagement'
import { Context } from '@/lib/validators/context'

import Search from './search/search'
import { CallbackButton } from './buttons'
import CurrentlyPlaying from './currentlyPlaying'
import { LeaveSession } from './sessionButtons'
import SongCarousel from './songCarousel'

interface sharedSessionProps {

}

const SharedSession: FC<sharedSessionProps> = ({ }) => {
  const currentlyPlaying = useSelector((state: Context) => state.currentlyPlaying)
  const status = useSelector((state: Context) => state.status)
  const { handleLeaveQueueSession } = useSessionManagement()
  // const host = currentlyPlaying?.userId ? getUser(currentlyPlaying.userId).then((user) => user) : null

  if (status === 'HOST') {
    return (
      <div className="w-full h-full">
        <div className="h-14 flex flex-row gap-4 items-center px-4">
          <CallbackButton text={`End Session`} callback={handleLeaveQueueSession} className="bg-red-800 glassmorphism !bg-opacity-75 hover:!bg-opacity-90 transition-colors" />
        </div>
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
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div className="h-14 w-full flex flex-row gap-4 items-center px-4">
        <CallbackButton text={`Leave Session`} callback={handleLeaveQueueSession} className="bg-red-800 glassmorphism !bg-opacity-75 hover:!bg-opacity-90 transition-colors" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <Suspense fallback={<div className='text-4xl'>Loading..</div>}>
          <CurrentlyPlaying />
        </Suspense>
      </div>
      <div className="w-full h-full flex flex-col items-center border-2 border-pink-700">
        <Suspense>
          <div className="w-full h-full border-2 border-teal-700">
            <Search />
          </div>
        </Suspense>
      </div>
    </div>
  )
}

export default SharedSession