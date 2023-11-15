"use client"

import {
  FC,
  Suspense,
} from "react"
import { useSelector } from "react-redux"

import { useSessionManagement } from "@/app/hooks/useSessionManagement"
import { useSuggested } from "@/app/hooks/useSuggested"
import { Context } from "@/lib/validators/context"

import Bug from "./error/bug"
import Search from "./search/search"
import { CallbackButton } from "./buttons"
import CurrentlyPlaying from "./currentlyPlaying"
import SongCarousel from "./songCarousel"

interface sharedSessionProps { }

const SharedSession: FC<sharedSessionProps> = ({ }) => {
  const status = useSelector((state: Context) => state.status)

  const { handleLeaveQueueSession } = useSessionManagement()

  if (status === 'IDLE') {
    console.warn("User should not be able to access this page without being in a session.")
    return (
      <Bug />
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div className="h-14 w-full flex flex-row gap-4 items-center px-4">
        <CallbackButton
          text={status === 'HOST' ? `End Session` : `Leave Session`}
          callback={handleLeaveQueueSession}
          className="bg-red-800 glassmorphism !bg-opacity-75 hover:!bg-opacity-90 transition-colors"
        />
      </div>
      {
        status === "HOST" ? (
          <HostSession />
        ) : (
          <MemberSession />
        )
      }
    </div>
  )
}

const HostSession = () => {

  const { suggested, queued, handleApprove, handleReject } = useSuggested()

  return (
    <div className="w-full h-[80vh] sm:h-full flex flex-col sm:grid sm:grid-cols-2 sm:grid-rows-1 items-center">
      <div className="min-h-[200px] h-1/2 sm:h-full max-h-[70vh] p-2 sm:p-4 flex items-center justify-center">
        <CurrentlyPlaying />
      </div>
      <div className="min-h-[340px] h-1/2 sm:h-full w-full sm:p-4 flex flex-col justify-between gap-4">
        <div className="w-full h-1/2 flex items-center justify-end">
          <SongCarousel header="Queued" songs={queued} />
        </div>
        <div className="w-full h-1/2 flex items-center justify-end">
          <SongCarousel
            header="Suggested"
            songs={suggested}
            interactive={{ onApprove: handleApprove, onReject: handleReject }}
          />
        </div>
      </div>
    </div>
  )
}

const MemberSession = () => {
  return (
    <div className="flex-1 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Suspense fallback={<div className="text-4xl">Loading..</div>}>
          <CurrentlyPlaying />
        </Suspense>
      </div>
      <div className="w-full h-full flex flex-col items-center">
        <Suspense>
          <div className="w-full h-full">
            <Search />
          </div>
        </Suspense>
      </div>
    </div>
  )
}

export default SharedSession
