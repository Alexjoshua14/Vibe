"use client"

import { FC } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"

import {
  createSession,
  destroySession,
} from "@/lib/queue-session/session-management"
import { Context } from "@/lib/validators/context"
import { setCurrentlyPlaying } from "@/redux/reducers/currentlyPlaying"
import { setStatus } from "@/redux/reducers/status"

import { useToast } from "./ui/use-toast"
import { CallbackButton } from "./buttons"

interface createSessionProps {}

export const CreateSession: FC<createSessionProps> = ({}) => {
  const { toast } = useToast()
  const dispatch = useDispatch()
  const router = useRouter()

  const handleCreateSession = async () => {
    let res = await createSession()

    if (res) {
      dispatch(setStatus("HOST"))
      // router.push(`/player/${res}`)
    } else {
      console.error("Error creating sessions")
      toast({
        title: "Error creating session",
        description:
          "You may already have an active session.. Try 'grab session' button instead",
      })
    }
  }

  return (
    <CallbackButton
      callback={() => handleCreateSession()}
      text="Start a Session"
    />
  )
}

interface destroySessionProps {}

export const DestroySession: FC<destroySessionProps> = ({}) => {
  const dispatch = useDispatch()
  const { toast } = useToast()

  const handleDestroySession = async () => {
    const res = await destroySession()

    if (res) {
      dispatch(setStatus("IDLE"))
      toast({
        title: "Session destroyed",
        description: "You may now create a new session",
      })
    } else {
      console.log("Looks like it failed to destroy a session..")
      toast({
        title: "Error destroying session",
        description: "You may not have an active session",
      })
    }
  }

  return (
    <CallbackButton
      callback={() => handleDestroySession()}
      text="Destroy a Session"
    />
  )
}

export const TEMPORARYGRAB: FC = ({}) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleGrab = async () => {
    dispatch(setStatus("HOST"))
  }

  return <CallbackButton callback={() => handleGrab()} text="Grab a Session" />
}

export const LeaveSession = () => {
  const dispatch = useDispatch()
  const status = useSelector((state: Context) => state.status)

  const handleLeave = () => {
    if (status === "MEMBER") {
      // Should remove user from members list in database but this is fine for now
      dispatch(setStatus("IDLE"))
      dispatch(setCurrentlyPlaying(null))
    } else if (status === "HOST") {
      // Should confirm with user first and actually clean up database but this is fine for now
      dispatch(setStatus("IDLE"))
      dispatch(setCurrentlyPlaying(null))
    }
  }

  return <CallbackButton callback={() => handleLeave()} text="Leave Session" />
}
