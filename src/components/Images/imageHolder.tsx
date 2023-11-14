
import { FC } from 'react'
import Image, { ImageProps } from 'next/image'

interface ImageHolderProps {
  src: string,
  alt: string,
  imageProps?: ImageProps
}

const ImageHolder: FC<ImageHolderProps> = ({ src, alt, imageProps }) => {
  return (
    <div className="relative max-w-full max-h-full aspect-square rounded overflow-clip glassmorphism-primary">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="33vw"
        className="object-cover"
        {...imageProps}
      />
    </div>
  )
}

export default ImageHolder