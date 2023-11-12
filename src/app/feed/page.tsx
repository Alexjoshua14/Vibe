import SongCard from "@/components/cards/songCard"
import { Post } from "@/components/songCard"
import { postSampleData } from "@/data/songs"

/**
 * The feed page, displays the posts from the
 * users that the current user follows
 *
 */
export default function Feed() {
  // Get Posts from Supabase using Prisma

  return (
    <div className="max-w-full">
      <div className="w-[600px] overflow-x-scroll">
        <div className="flex flex-row gap-4 ">
          <SongCard
            songName={postSampleData.item.name}
            image={{ url: postSampleData.item.album.images[0].url, alt: "" }}
            artists={postSampleData.item.artists
              .map((artist) => artist.name)
              .join(", ")}
          />
          <SongCard
            songName={postSampleData.item.name}
            image={{ url: postSampleData.item.album.images[0].url, alt: "" }}
            artists={postSampleData.item.artists
              .map((artist) => artist.name)
              .join(", ")}
          />
          <SongCard
            songName={postSampleData.item.name}
            image={{ url: postSampleData.item.album.images[0].url, alt: "" }}
            artists={postSampleData.item.artists
              .map((artist) => artist.name)
              .join(", ")}
          />
          <SongCard
            songName={postSampleData.item.name}
            image={{ url: postSampleData.item.album.images[0].url, alt: "" }}
            artists={postSampleData.item.artists
              .map((artist) => artist.name)
              .join(", ")}
          />
          <SongCard
            songName={postSampleData.item.name}
            image={{ url: postSampleData.item.album.images[0].url, alt: "" }}
            artists={postSampleData.item.artists
              .map((artist) => artist.name)
              .join(", ")}
          />
        </div>
      </div>
    </div>
  )
}
