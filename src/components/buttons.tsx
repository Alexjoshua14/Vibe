"use client"

import { FC, HTMLAttributes } from "react"
import { useDispatch } from "react-redux"
import Link from "next/link"
import { signIn, signOut } from "next-auth/react"

import { useSessionManagement } from "@/app/hooks/useSessionManagement"
import { destroySession } from "@/lib/queue-session/session-management"
import { cn } from "@/lib/utils"
import { setCurrentlyPlaying } from "@/redux/reducers/currentlyPlaying"
import { setStatus } from "@/redux/reducers/status"

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
    <button
      onClick={() => destroySession}
      className="bg-red-950 text-stone-50 px-4 py-2 rounded glassmorphism-2-interactive"
    >
      End Session ⚠️
    </button>
  )
}

export const CallbackButton = ({
  callback,
  text,
  className,
}: {
  callback: () => void
  text: string
  className?: string
}) => {
  return (
    <button
      className={cn(
        `px-4 py-2 bg-teal-900 text-slate-50 text-lg rounded`,
        className,
      )}
      onClick={() => callback()}
    >
      {text}
    </button>
  )
}

interface JoinSessionProps extends HTMLAttributes<HTMLButtonElement> {
  sessionId: string
  text: string
  handleJoinSession: (sessionId: string) => void
}

export const JoinSession: FC<JoinSessionProps> = ({
  sessionId,
  text,
  handleJoinSession,
  className,
}) => {
  return (
    <button
      onClick={() => handleJoinSession(sessionId)}
      className={cn(
        "glassmorphism-2-interactive px-4 py-2 rounded !bg-tertiary",
        className,
      )}
    >
      {text}
    </button>
  )
}
