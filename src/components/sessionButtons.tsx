'use client'

import { FC } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'

import { createSession, destroySession } from '@/lib/queue-session/session-management'
import { setStatus } from '@/redux/reducers/status'

import { CallbackButton } from './buttons'


interface createSessionProps {

}

export const CreateSession: FC<createSessionProps> = ({ }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleCreateSession = async () => {
    let res = await createSession()

    if (res) {
      dispatch(setStatus('HOST'))
      router.push(`/player/${res}`)
    } else {
      console.error("Error creating sessions")
    }
  }

  return <CallbackButton callback={() => handleCreateSession()} text="Start a Session" />
}

interface destroySessionProps {

}

export const DestroySession: FC<destroySessionProps> = ({ }) => {
  const dispatch = useDispatch()

  const handleDestroySession = async () => {
    const res = await destroySession()

    if (res) {
      dispatch(setStatus('IDLE'))
    } else {
      console.log("Looks like it failed to destroy a session..")
    }
  }

  return <CallbackButton callback={() => handleDestroySession()} text="Destroy a Session" />
}

export const TEMPORARYGRAB: FC = ({ }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleGrab = async () => {
    dispatch(setStatus('HOST'))
    router.push(`/player/hosting`)
  }

  return <CallbackButton callback={() => handleGrab()} text="Grab a Session" />
}