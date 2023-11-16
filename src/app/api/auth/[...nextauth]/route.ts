import NextAuth from "next-auth"

import { authOptions } from "@/utilities/OAuth/authOptions"

/**
 * Export handler as GET and POST
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
