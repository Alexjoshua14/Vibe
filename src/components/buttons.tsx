"use client"

import { FC, HTMLAttributes } from "react"
import { useDispatch } from "react-redux"
import Link, { LinkProps } from "next/link"
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
export const LoginButton: FC<Partial<HTMLAttributes<HTMLButtonElement>>> = ({ ...props }) => {
  return <button onClick={() => signIn()} {...props}>Sign In</button>
}

export const LogoutButton: FC<Partial<HTMLAttributes<HTMLButtonElement>>> = ({ ...props }) => {
  return <button onClick={() => signOut()} {...props}>Sign Out</button>
}

/**
 * Next.js page navigation buttons
 *
 */
export const HomeButton: FC<Partial<LinkProps & HTMLAttributes<HTMLAnchorElement>>> = ({ href, ...props }) => {
  return <Link href="/" {...props}>Home</Link>
}

export const FeedButton: FC<Partial<LinkProps & HTMLAttributes<HTMLAnchorElement>>> = ({ href, ...props }) => {
  return <Link href="/feed" {...props}>Feed</Link>
}

export const PlayerButton: FC<Partial<LinkProps & HTMLAttributes<HTMLAnchorElement>>> = ({ href, ...props }) => {
  return <Link href="/player" className={props.className} {...props}>Player</Link>
}

export const ProfileButton: FC<Partial<LinkProps & HTMLAttributes<HTMLAnchorElement>>> = ({ href, ...props }) => {
  return <Link href="/profile" {...props}>Profile</Link>
}

export const EndSession: FC<Partial<HTMLAttributes<HTMLButtonElement>>> = ({ ...props }) => {
  return (
    <button
      onClick={() => destroySession}
      className="bg-red-950 text-stone-50 px-4 py-2 rounded glassmorphism-2-interactive"
      {...props}
    >
      End Session ⚠️
    </button>
  )
}

interface CallbackButtonProps extends Partial<HTMLAttributes<HTMLButtonElement>> {
  callback: () => void
  text: string
}

export const CallbackButton: FC<CallbackButtonProps> = ({
  callback,
  text,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        `px-4 py-2 bg-teal-900 text-slate-50 text-lg rounded`,
        className,
      )}
      onClick={() => callback()}
      {...props}
    >
      {text}
    </button>
  )
}

interface JoinSessionProps extends Partial<HTMLAttributes<HTMLButtonElement>> {
  sessionId: string
  text: string
  handleJoinSession: (sessionId: string) => void
}

export const JoinSessionButton: FC<JoinSessionProps> = ({
  sessionId,
  text,
  handleJoinSession,
  className,
  ...props
}) => {
  return (
    <button
      onClick={() => handleJoinSession(sessionId)}
      className={cn(
        "glassmorphism-2-interactive px-4 py-2 rounded !bg-tertiary",
        className,
      )}
      {...props}
    >
      {text}
    </button>
  )
}
