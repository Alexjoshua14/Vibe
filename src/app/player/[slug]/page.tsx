import { FC, Suspense } from 'react'

import CurrentlyPlaying from '@/components/currentlyPlaying'
import Search from '@/components/search'

interface pageProps {
  params: {
    slug: string
  }
}


/**
 * The player page, displays the currently playing song 
 * and allows the user to search for songs to add to the queue
 * 
 */
export default function SharedQueue({ params }: pageProps) {
  // grab queue id from [...slug]

  // If user isn't even logged in send them home
  // Maybe eventually allow for anonymous access

  // Check if user should have access
  // if user has access, check if host or member
  // if user doesn't have access, allow them to request access?

  // Grab currently playing and queue data from database
  // 

  return (
    <main className="flex-1 p-4 flex flex-col items-center justify-around overflow-hidden">
      <div className="flex flex-col">
        <div className="flex gap-4 h-[400px] sm:h-[140px]">
          <Suspense fallback={<div>Loading stuff</div>}>
            <CurrentlyPlaying />
          </Suspense>
        </div>
      </div>
      <Search />
    </main>
  )
}