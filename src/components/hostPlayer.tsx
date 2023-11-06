// "use client"

// import { FC } from "react"

// import { useCurrentlyPlaying } from "@/app/hooks/useCurrentlyPlayingHost"
// import { getSongImage } from "@/lib/prisma/song"

// import { SongCard2 } from "./songCard"

// interface hostPlayerProps { }

// const HostPlayer: FC<hostPlayerProps> = ({ }) => {
//   const { currentlyPlaying, progress, imageURL } = useCurrentlyPlaying()
//   const image =
//     currentlyPlaying?.song?.albumId
//       ? getSongImage(currentlyPlaying?.song?.albumId)
//       : { url: "" }

//   if (currentlyPlaying?.song) {
//     return <SongCard2 song={currentlyPlaying.song} progress_ms={progress.time} imageURL={imageURL} />
//   } else if (currentlyPlaying == undefined) {
//     return <div className="text-pink-700">Loading stuff!</div>
//   } else {
//     return (
//       <div className="flex h-full w-full justify-center items-center text-center text-teal-700">
//         <h1>Start listening to something..</h1>
//       </div>
//     )
//   }
// }

// export default HostPlayer
