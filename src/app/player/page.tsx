import React, { Suspense } from "react";

import CurrentlyPlaying from "@/components/currentlyPlaying";
import Search from "@/components/search";

/**
 * The player page, displays the currently playing song 
 * and allows the user to search for songs to add to the queue
 * 
 */
export default function Player() {

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
