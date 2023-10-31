'use client'

import React from 'react';
import { signIn, signOut,useSession } from 'next-auth/react';

/**
 * Profile page, where user can change their settings
 * Currently only has a sign in/out button
 */
export default function Profile() {
  const { data: session, status } = useSession();
  let user = {
    name: "John Doe",
    email: "tester@gmail.com",
  }
  console.log(session, status);

  const signinoutButton = () => {
    if (status === "authenticated") {
      return (
        <button onClick={() => signOut()} className="w-full h-full rounded-full bg-red-700">
          Sign out
        </button> 
      )
    } else if (status === "loading") {
      return (
        <></>
      )
     } else {
      return (
        <button onClick={() => signIn()} className="w-full h-full rounded-full bg-green-700">
          Sign in
        </button> 
      )
    }
  }

  return (
    <main className="flex-1 p-4 flex flex-col items-center justify-around overflow-hidden border-2 border-yellow-500 rounded-lg">
      <div className="flex w-full h-40 text-center justify-center items-center border-2 rounded-lg border-pink-500">
        <span className="text-lg">
          {status === "authenticated" ? 
            `Signed in as ${user.name}` 
            : status === "loading" ?
            `Loading...`
            : `Not signed in..` 
          }
        </span>
      </div>
      <div className="flex w-full h-full justify-center items-center border-2 border-teal-500 rounded-lg">
        <div className="w-[180px] h-[80px] flex items-center justify-center text-2xl font-extralight">
          {signinoutButton()}
        </div>
      </div>
    </main>
  )


}