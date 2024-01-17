import { FC } from "react"

import CreateSessionForm from "./sessionSetup/createSessionForm"
import JoinSession from "./sessionSetup/joinSession"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export interface setupSessionProps { }

const SetupSession: FC<setupSessionProps> = ({ }) => {
  return (
    <Tabs defaultValue="join" className="flex flex-col items-center">
      <TabsList>
        <TabsTrigger value="create">Create Session</TabsTrigger>
        <TabsTrigger value="join">Join Session</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <div className=" flex flex-col items-center justify-center gap-4">
          <CreateSessionForm />
        </div>
      </TabsContent>
      <TabsContent value="join">
        <JoinSession />
      </TabsContent>
    </Tabs>
  )
}

export default SetupSession
