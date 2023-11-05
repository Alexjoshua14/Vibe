'use client'

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { CallbackButton } from "@/components/buttons"
import {
  createSession,
  destroySession,
} from "@/lib/queue-session/session-management"

const handleCreateSession = () => {
  createSession().then((something) => {
    console.log("Here is something from the promise: " + something)
  })
}

const handleDestroySession = async () => {
  const res = await destroySession()

  if (res) {
    console.log("Successfull created currently Playing object")
  } else {
    console.log("Looks like it failed to destroy a session..")
  }
}

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
      <CallbackButton callback={() => handleCreateSession()} text="Start a Session" />
      <Link href="/player/join" className="px-14 py-7 bg-fuchsia-900 text-slate-50 text-2xl rounded">
        Join a Session
      </Link>
      <CallbackButton callback={() => handleDestroySession()} text="Delete a Session ⚠️" />
    </main>
  )
}
