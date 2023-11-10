'use client'

import { FC } from 'react'
import { useSelector } from 'react-redux'

import { Context } from '@/lib/validators/context'

import SetupSession from './setupSession'
import { setupSessionProps } from './setupSession'
import SharedSession from './sharedSession'

interface sessionDividerProps {

}

const SessionDivider: FC<sessionDividerProps & setupSessionProps> = ({ availableSessions, users }) => {
  const status = useSelector((state: Context) => state.status)

  if (status === 'IDLE') {
    return <SetupSession availableSessions={availableSessions} users={users} />
  } else {
    return <SharedSession />
  }

  return <div>sessionDivider</div>
}

export default SessionDivider