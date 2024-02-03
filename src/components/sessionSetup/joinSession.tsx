"use client"

import { FC, useEffect, useState } from "react"

import { useSessionManagement } from "@/app/hooks/useSessionManagement"
import {
  AvailableSession,
  getAvailableSessions,
} from "@/lib/queue-session/sessionSetup"

import { JoinSessionButton } from "../buttons/SessionButtons"

interface JoinSessionProps { }

const JoinSession: FC<JoinSessionProps> = ({ }) => {
  const { handleJoinSession } = useSessionManagement()
  const [availableSessions, setAvailableSessions] = useState<
    AvailableSession[]
  >([])
  const [loadingAvailableSessions, setLoadingAvailableSessions] =
    useState<boolean>(true)

  useEffect(() => {
    const fetchAvailableSessions = async () => {
      const availableSessions = await getAvailableSessions()
      setAvailableSessions(availableSessions)
      setLoadingAvailableSessions(false)
    }

    fetchAvailableSessions()
  })
  return (
    <div className="h-[300px] w-[400px] flex flex-col items-center justify-center gap-4">
      {availableSessions.length > 0 ? (
        availableSessions.map((session) => (
          <JoinSessionButton
            key={session.id}
            sessionId={session.id}
            handleJoinSession={handleJoinSession}
            text={`Join ${session.hostName}'s session!`}
          />
        ))
      ) : (
        <p>No sessions available at the moment..</p>
      )}
    </div>
  )
}

export default JoinSession
