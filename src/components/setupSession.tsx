import { FC } from 'react'
import { CurrentlyPlaying, User } from '@prisma/client'

import { useSessionManagement } from '@/app/hooks/useSessionManagement'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { JoinSession } from './buttons'
import { CreateSession, DestroySession, TEMPORARYGRAB } from './sessionButtons'

export interface setupSessionProps {
  availableSessions: CurrentlyPlaying[],
  users: (User | null)[]
}

const SetupSession: FC<setupSessionProps> = ({ availableSessions, users }) => {
  const { handleJoinSession } = useSessionManagement()

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
          {availableSessions.length > 0 ? availableSessions.map((session, index) => (
            <JoinSession key={session.id} sessionId={session.id} handleJoinSession={handleJoinSession} text={`Join ${users.filter((u) => u?.id === session.userId)[0]?.name ?? 'unknown'}'s session!`} />
          )) : (
            <p>
              No sessions available at the moment..
            </p>
          )}
        </div>
      </TabsContent>

    </Tabs>
  )
}

export default SetupSession