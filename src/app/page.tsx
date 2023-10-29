
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';

import { LoginButton, LogoutButton } from "@/components/buttons";
import { SongCard } from "@/components/songCard";

import { songs } from "@/data/songs";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("No session found.")
    redirect('/api/auth/signin?callbackUrl=/');
  }

  return (
    <main className="flex-1 p-16 flex flex-col items-center justify-between border-2 border-orange-500">
      <section className="flex flex-col">
        <h1>
          Welcome Home!
        </h1>
        <div className="p-4 border-2 border-yellow-500">
          {session ? <LogoutButton /> : <LoginButton />}
        </div>
        <div className="flex gap-4">
          <SongCard song={songs[4]} />
        </div>
      </section>
    </main>
  )
}
