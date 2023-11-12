import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { CallbackButton, JoinSession } from "@/components/buttons"
import {
  CreateSession,
  DestroySession,
  TEMPORARYGRAB,
} from "@/components/sessionButtons"
import SessionDivider from "@/components/sessionDivider"
import SetupSession from "@/components/setupSession"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserDeep } from "@/lib/prisma/user"
import {
  createSession,
  destroySession,
  listAllSessions,
} from "@/lib/queue-session/session-management"

/**
 * Allows the user to either start a shared queue session or join one
 *
 * TODO: Checks that need to be instantiated
 *  - Verify user is logged in
 */
export default async function Player() {
  let availableSessions = await listAllSessions()
  let userPromises = availableSessions.map(async (session) => {
    const user = await getUserDeep(session.userId)
    return user
  })

  let users = await Promise.all(userPromises)

  //Upon creating new session
  // Need to create the database objects
  // Then need to update the currently playing track and ideally set up
  // a means for it to be updated regularly (this could be handled in specific page for queue using useEffect)

  return (
    <main className="flex-1 p-4 flex flex-col items-center justify-around">
      <SessionDivider availableSessions={availableSessions} users={users} />
    </main>
  )
}
