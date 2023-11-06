'use client'

import { FC } from 'react'
import { useSelector } from 'react-redux'

import { getUser } from '@/lib/prisma/user'
import { Context } from '@/lib/validators/context'

import CurrentlyPlaying from './currentlyPlaying'
import Search from './search'
import { LeaveSession } from './sessionButtons'

interface sharedSessionProps {

}

const SharedSession: FC<sharedSessionProps> = ({ }) => {
  const currentlyPlaying = useSelector((state: Context) => state.currentlyPlaying)
  const status = useSelector((state: Context) => state.status)
  const host = currentlyPlaying?.userId ? getUser(currentlyPlaying.userId).then((user) => user) : null

  if (status === 'HOST') {
    return (
      <div>
        <h1>Host</h1>
        <CurrentlyPlaying />
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