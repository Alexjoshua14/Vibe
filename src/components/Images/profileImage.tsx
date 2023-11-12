import { FC } from "react"
import Image from "next/image"

interface profileImageProps {
  imageUrl: string
  altText: string
  [key: string]: any
}

const ProfileImage: FC<profileImageProps> = ({
  imageUrl,
  altText,
  ...props
}) => {
  return (
    <div className="aspect-square rounded-full flex center">
      <Image src={imageUrl} alt={altText} width={50} height={50} {...props} />
    </div>
  )
}

export default ProfileImage
