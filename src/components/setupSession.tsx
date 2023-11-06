import { FC } from 'react'
import { CurrentlyPlaying, User } from '@prisma/client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { JoinSession } from './buttons'
import { CreateSession, DestroySession, TEMPORARYGRAB } from './sessionButtons'

export interface setupSessionProps {
  availableSessions: CurrentlyPlaying[],
  users: User[]
}

const SetupSession: FC<setupSessionProps> = ({ availableSessions, users }) => {
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
          {availableSessions.map((session, index) => (
            <JoinSession key={session.id} sessionId={session.id} text={`Join ${users.filter((u) => u.id === session.userId)[0].name ?? 'unknown'}'s session!`} />
          ))}
        </div>
      </TabsContent>

    </Tabs>
  )
}

export default SetupSession