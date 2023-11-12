import { FC } from "react"
import Image from "next/image"

interface postImageProps {
  imageUrl: string
  altText: string
  [key: string]: any
}

const PostImage: FC<postImageProps> = ({ imageUrl, altText, ...props }) => {
  return (
    <div className="relative h-1/2 aspect-square flex center rounded-br overflow-hidden">
      <Image src={imageUrl} alt={altText} fill={true} {...props} />
    </div>
  )
}

export default PostImage
