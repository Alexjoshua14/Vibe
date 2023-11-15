'use client'

import React from "react"
import { useSelector } from "react-redux"

import SetupSession from "@/components/setupSession"
import SharedSession from "@/components/sharedSession"
import { Context } from "@/lib/validators/context"

import { useSessionManagement } from "../hooks/useSessionManagement"

/**
 * Allows the user to either start a shared queue session or join one
 *
 * TODO: Checks that need to be instantiated
 *  - Verify user is logged in
 */
export default function Player() {
  const status = useSelector((state: Context) => state.status)
  useSessionManagement()

  // Waits to return until the status is known
  if (status === "LOADING")
    return

  return (
    <main className="flex-1 max-w-full p-2 sm:p-4 flex flex-col items-center justify-around">
      {status === "IDLE"
        ? (
          <SetupSession />
        ) : (
          <SharedSession />
        )}
    </main>
  )
}





