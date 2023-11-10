import { useDispatch, useSelector } from 'react-redux'

import { setCurrentlyPlaying } from '@/redux/reducers/currentlyPlaying'
import { setStatus } from '@/redux/reducers/status'

import 'client-only'

import { destroySession } from '../../lib/queue-session/session-management'
import { Context } from '../../lib/validators/context'

export function useSessionManagement() {
  const dispatch = useDispatch()
  const status = useSelector((state: Context) => state.status)

  const handleLeaveQueueSession = async () => {
    let res = true
    if (status === 'HOST') {
      // Manage database components if user is the hsot
      res = await destroySession()
    } else if (status === 'IDLE') {
      console.warn("HandleLeaveSession function called by an IDLE use")
      return
    }

    if (res) {
      dispatch(setStatus('IDLE'))
      dispatch(setCurrentlyPlaying(null))
    } else {
      console.log("Something went wrong with the destruction of the session..")
    }
  }

  return { handleLeaveQueueSession }

}