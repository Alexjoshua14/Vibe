
import { Post } from "@/components/songCard";
import { PostData } from "@/types";
import { postSampleData } from "@/data/songs";

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