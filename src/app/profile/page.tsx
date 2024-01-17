import React from "react"
import { getServerSession } from "next-auth"

import { LoginButton, LogoutButton } from '@/components/buttons/AuthButtons'
import { authOptions } from "@/utilities/OAuth/authOptions"


/**
 * Profile page, where user can change their settings
 * Currently only has a sign in/out button
 */
export default async function Profile() {
  const session = await getServerSession(authOptions)
  const signedIn = !!session

  return (
    <main className="flex-1 p-4 flex flex-col items-center justify-around overflow-hidden border-2 border-yellow-500 rounded-lg">
      <div className="flex w-full h-40 text-center justify-center items-center border-2 rounded-lg border-pink-500">
        <span className="text-lg">
          {signedIn
            ? `Signed in as ${session.user.name}`
            : `Not signed in..`}
        </span>
      </div>
      <div className="flex w-full h-full justify-center items-center border-2 border-teal-500 rounded-lg">
        <div className="w-[180px] h-[80px] flex items-center justify-center text-2xl font-extralight">
          {
            signedIn ?
              <LogoutButton className="w-full h-full rounded-full px-8 py-6 glassmorphism-tertiary-interactive bg-red-800 text-white text-xl" />
              : <LoginButton className="w-full h-full rounded-full px-8 py-6 glassmorphism-tertiary-interactive bg-green-800 text-white text-xl" />
          }
        </div>
      </div>
    </main>
  )
}
