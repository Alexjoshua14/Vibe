import React from "react"
import { redirect } from "next/navigation"

import { NewPost } from "@/components/newPost"

export default function Post() {
  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test")
    redirect("/")

  return (
    <main className="flex-1 flex justify-center items-center">
      <NewPost />
    </main>
  )
}
