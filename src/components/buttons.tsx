'use client'

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";


/**
 * NextAuth authentication buttons
 * 
 */
export const LoginButton = () => {
  return (
    <button onClick={() => signIn()}>Sign In</button>
  )
}

export const LogoutButton = () => {
  return (
    <button onClick={() => signOut()}>Sign Out</button>
  )
}

/**
 * Next.js page navigation buttons
 * 
 */

export const HomeButton = () => {
  return (
    <Link href="/">
      Home
    </Link>
  )
}

export const FeedButton = () => {
  return (
    <Link href="/feed">
      Feed
    </Link>
  )
}

export const PlayerButton = () => {
  return (
    <Link href="/player">
      Player
    </Link>
  )
}

export const ProfileButton = () => {
  return (
    <Link href="/profile">
      Profile
    </Link>
  )
}