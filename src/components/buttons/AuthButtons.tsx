'use client'

import { FC, HTMLAttributes } from "react"
import { signIn, signOut } from "next-auth/react"

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