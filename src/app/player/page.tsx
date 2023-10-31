'use client'
import React from "react";

import { createSession, destroySession } from "@/lib/queue-session/session-management";

/**
 * Allows the user to either start a shared queue session or join one
 * 
 * TODO: Checks that need to be instantiated
 *  - Verify user is logged in
 */
export default function Player() {

  //Upon creating new session
  // Need to create the database objects
  // Then need to update the currently playing track and ideally set up
  // a means for it to be updated regularly (this could be handled in specific page for queue using useEffect)

  return (
    <main className="flex-1 p-4 flex flex-col items-center justify-around overflow-hidden">
      <button className="px-14 py-7 bg-teal-900 text-slate-50 text-2xl rounded"
        onClick={() => createSession()}
      >
        Start a Session
      </button>
      <button className="px-14 py-7 bg-fuchsia-900 text-slate-50 text-2xl rounded">
        Join a Session
      </button>
      <button className="px-14 py-7 bg-red-900 text-slate-50 text-2xl rounded" onClick={() => destroySession()}>
        Delete a Session ⚠️
      </button>
    </main>
  )
}
