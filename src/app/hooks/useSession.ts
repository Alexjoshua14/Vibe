import { getServerSession } from "next-auth"

import { authOptions } from "@/utilities/OAuth/authOptions"

export const useSession = async () => {
  const session = await getServerSession(authOptions)

  return session
}
