
import { Post } from "@/components/songCard";
import { PostData } from "@/types";
import { postSampleData } from "@/data/songs";

/**
 * The feed page, displays the posts from the 
 * users that the current user follows
 * 
 */
export default function Feed() {
  // Get Posts from Supabase using Prisma
  

  return (
    <div className="max-w-full">
      <div className="list">
        <Post post={postSampleData} />
        <Post post={postSampleData} />
        <Post post={postSampleData} />
        <Post post={postSampleData} />
        <Post post={postSampleData} />
        <Post post={postSampleData} />
      </div>
    </div>
  )
}