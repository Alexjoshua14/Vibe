
import prisma from "../prisma"

export async function getSuggested(suggestedId: string) {
  return await prisma.suggested.findFirst({
    where: {
      id: suggestedId
    }
  })
}