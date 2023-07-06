import NextAuth from "next-auth"

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [

  ],
})

export { handler as GET, handler as POST }