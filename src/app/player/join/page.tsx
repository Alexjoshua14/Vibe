
import Link from "next/link"

import { getUserDeep } from "@/lib/prisma/user"
import { listAllSessions } from "@/lib/queue-session/session-management"


export default async function Join() {
  let availableSessions = await listAllSessions()
  let userPromises = availableSessions.map(async (session) => {
    const user = await getUserDeep(session.userId)
    return user
  })

  let users = await Promise.all(userPromises)


  return (
    <main className="flex-1 p-4 flex flex-col items-center justify-around overflow-hidden">
      {availableSessions.map((session, index) => (
        <Link href={`/player/host/${session.id}`} key={session.id} className="flex flex-col gap-2 bg-pink-300">
          <p>{`Session id: ${session.id}`}</p>
          <p>{`Session is userId: ${session.userId}`}</p>
          <div>
            <p>{`User information: `}</p>
            <p>{users[index]?.name}</p>
          </div>
          <p>{`Session is suggestedId: ${session.suggestedId}`}</p>
          <p>{`Session is queueId: ${session.queueId}`}</p>
          <p>{`Session is songId: ${session.songId}`}</p>
          <p>{`Session is playing: ${session.is_playing}`}</p>
          <p>{`Session is progress: ${session.progress_ms}`}</p>
          <p>{`Session is timestamp: ${session.timestamp.toString()}`}</p>
        </Link>
      ))}
    </main>
  )
}