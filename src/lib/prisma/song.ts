'use server'

export const getSongImage = async (albumId: number) => {
  const image = await prisma?.image.findFirst({
    where: {
      albumId: albumId
    }
  })

  return image
}