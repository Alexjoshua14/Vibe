
import prisma from "../prisma"

export async function getQueue(queueId: string) {
  return await prisma.queue.findFirst({
    where: {
      id: queueId
    }
  })
}