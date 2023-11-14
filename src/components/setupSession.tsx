import { FC, useEffect, useState } from "react"
import { CurrentlyPlaying, Session, User } from "@prisma/client"

import { useSessionManagement } from "@/app/hooks/useSessionManagement"
import { AvailableSession, getAvailableSessions } from "@/lib/queue-session/sessionSetup"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { JoinSession } from "./buttons"
import { CreateSession, DestroySession, TEMPORARYGRAB } from "./sessionButtons"

export interface setupSessionProps {

}

const SetupSession: FC<setupSessionProps> = ({ }) => {
  const { handleJoinSession } = useSessionManagement()
  const [availableSessions, setAvailableSessions] = useState<AvailableSession[]>([])
  const [loadingAvailableSessions, setLoadingAvailableSessions] = useState<boolean>(true)

  useEffect(() => {
    const fetchAvailableSessions = async () => {
      const availableSessions = await getAvailableSessions()
      setAvailableSessions(availableSessions)
      setLoadingAvailableSessions(false)
    }

    fetchAvailableSessions()
  })

  return (
    <Tabs defaultValue="join" className="flex flex-col items-center">
      <TabsList>
        <TabsTrigger value="create">Create Session</TabsTrigger>
        <TabsTrigger value="join">Join Session</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <div className="h-[300px] w-[400px] flex flex-col items-center justify-center gap-4">
          <DestroySession />
          <CreateSession />
          <TEMPORARYGRAB />
        </div>
      </TabsContent>
      <TabsContent value="join">
        <div className="h-[300px] w-[400px] flex flex-col items-center justify-center gap-4">
          {availableSessions.length > 0 ? (
            availableSessions.map((session) => (
              <JoinSession
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
      </TabsContent>
    </Tabs>
  )
}

export default SetupSession
