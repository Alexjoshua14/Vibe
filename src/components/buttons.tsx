"use client"

import Link from "next/link"
import { signIn, signOut } from "next-auth/react"

import { destroySession } from "@/lib/queue-session/session-management"

/**
 * NextAuth authentication buttons
 *
 */
export const LoginButton = () => {
  return <button onClick={() => signIn()}>Sign In</button>
}

export const LogoutButton = () => {
  return <button onClick={() => signOut()}>Sign Out</button>
}

/**
 * Next.js page navigation buttons
 *
 */
export const HomeButton = () => {
  return <Link href="/">Home</Link>
}

export const FeedButton = () => {
  return <Link href="/feed">Feed</Link>
}

export const PlayerButton = () => {
  return <Link href="/player">Player</Link>
}

export const ProfileButton = () => {
  return <Link href="/profile">Profile</Link>
}

export const EndSession = () => {
  return (
    <button onClick={() => destroySession} className="bg-red-950 text-stone-50 px-4 py-2 rounded glassmorphism-2-interactive">
      End Session ⚠️
    </button>
  )
}