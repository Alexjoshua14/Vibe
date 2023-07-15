
import { Post } from "@/components/songCard";
import { PostData } from "@/types";
import { postSampleData } from "@/data/songs";

/**
 * The feed page, displays the posts from the 
 * users that the current user follows
 * 
 */
export default function Feed() {
  return (
    <div className="max-w-full">
      <div className="flex flex-col gap-8 w-full px-1">
        <Post post={postSampleData} />
        <Post post={postSampleData} />
        <Post post={postSampleData} />
      </div>
    </div>
  )
}