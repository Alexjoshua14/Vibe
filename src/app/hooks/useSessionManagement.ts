import { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addUserToSession, reconnect } from '@/lib/prisma/currentlyPlaying'
import { setCurrentlyPlaying } from '@/redux/reducers/currentlyPlaying'
import { setStatus } from '@/redux/reducers/status'

import 'client-only'

import { destroySession, removeUserFromSession } from '../../lib/queue-session/session-management'
import { Context } from '../../lib/validators/context'

export function useSessionManagement() {
  const dispatch = useDispatch()
  const status = useSelector((state: Context) => state.status)

  useEffect(() => {
    const grabPreviousSession = async () => {
      const {cpID, prevStatus} = await reconnect()
      if (cpID !== null && cpID !== undefined && prevStatus !== null) {
        console.log("Found previous session: " + cpID + " with status: " + prevStatus)
        dispatch(setCurrentlyPlaying({id: cpID}))
        dispatch(setStatus(prevStatus))
      } else {
        console.log("No previous session found")
        dispatch(setStatus('IDLE'))
      }
    }

    if ( status === 'LOADING')
      grabPreviousSession()

  }, [dispatch, status])

  const handleLeaveQueueSession = async () => {
    let res = true
    if (status === 'HOST') {
      // Manage database components if user is the hsot
      res = await destroySession()
    } else if (status === 'IDLE' || status === 'LOADING') {
      console.warn(`HandleLeaveSession function called by an ${status} use`)
      return
    }

    if (res) {
      // Disconnect user from session in database
      res = await removeUserFromSession()
      dispatch(setStatus('IDLE'))
      dispatch(setCurrentlyPlaying(null))
    } else {
      console.log("Something went wrong with the destruction of the session..")
    }
  }

  const handleJoinSession = async (sessionId: string) => {
   
    const res = addUserToSession(sessionId)

    dispatch(setCurrentlyPlaying({ id: sessionId }))
    dispatch(setStatus('MEMBER'))
  
  }

  return { handleJoinSession, handleLeaveQueueSession }

}