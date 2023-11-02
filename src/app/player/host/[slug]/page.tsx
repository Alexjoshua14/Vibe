import { FC, Suspense } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { EndSession } from "@/components/buttons"
import CurrentlyPlaying from "@/components/currentlyPlaying"
import HostPlayer from "@/components/hostPlayer"
import Search from "@/components/search"
import { getQueueSession } from "@/lib/queue-session/session-management"

interface pageProps {
  params: {
    slug: string
  }
}

/**
 * Host section for shared queue
 * Allows host to:
 *    - See and manage the currently playing song
 *    - See songs in the queue
 *    - See songs suggested to be played
 *    - See and manage members
 *    - Manage session (i.e., end session)
 *
 */
export default async function SharedQueue({ params }: pageProps) {
  // grab queue id from [...slug]

  // If user isn't even logged in send them home
  // Maybe eventually allow for anonymous access

  // Check if user should have access
  // if user has access, check if host or member
  // if user doesn't have access, allow them to request access?

  /** TODO: Possibly move this check out to middleware */
  // Grab currently playing and queue data from database
  const currentlyPlaying = await getQueueSession(params.slug)
  const session = await getServerSession(authOptions)
  if (currentlyPlaying?.userId !== session?.user.id) {
    console.error("You are not the queue host!")
    redirect("/player")
  }

  return (
    <main className="flex-1 p-4 flex flex-col items-center justify-around overflow-hidden">
      <div className="flex flex-col">
        <div className="flex gap-4 h-[400px] sm:h-[140px]">
          <div>
            <p>

            </p>
          </div>
          <Suspense fallback={<div>Loading stuff</div>}>
            <HostPlayer />
          </Suspense>
        </div>
        <div>
          <EndSession />
        </div>
      </div>
      <Search />
    </main>
  )
}
