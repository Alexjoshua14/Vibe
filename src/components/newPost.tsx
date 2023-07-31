'use client'

import { useState } from "react"

export const NewPost = () => {
  const [query, setQuery] = useState<string>("")
  return (
    <form className="flex flex-col gap-4 w-[360px] justify-center bg-gray-600 rounded-lg bg-opacity-40 backdrop-blur-lg">
      <div className="flex py-2 px-4 justify-between items-center">
        <button className="rounded-full bg-red-700 px-2 py-1">Cancel</button>
        <button className="rounded-full bg-green-600 px-6 py-1">Next</button>
      </div>
      <div className="flex flex-col gap-2 px-4 py-8">
        <label htmlFor="post-song" className="sr-only">Post song</label>
        <textarea id="post-song" name="post-song" rows={1} maxLength={27}
          className="shadow-sm block w-full h-[40px] resize-none 
                    px-2 py-2 whitespace-nowrap
                  focus:ring-indigo-500 focus:border-indigo-500 
                  sm:text-sm text-black border-gray-300 rounded-lg
                  bg-gray-500 placeholder:text-gray-700"
          placeholder="Search for a song.."
        />
        {/* <label htmlFor="post-title" className="sr-only">Post Title</label>
        <textarea id="post-title" name="post-title" rows={3} className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" placeholder="Title"></textarea>
        <label htmlFor="post-caption" className="sr-only">Post Caption</label>
        <textarea id="post-caption" name="post-caption" rows={3} className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" placeholder="What's on your mind?"></textarea> */}
      </div>
    </form>
  )
}