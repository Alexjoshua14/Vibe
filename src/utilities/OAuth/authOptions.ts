import { PrismaAdapter } from "@auth/prisma-adapter";
import { Account,NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify"

import { spotifyScope } from "@/constants/spotify";
import prisma from "@/lib/prisma";

import { tokenExpired } from "../helper";

import { refreshAccessToken, refreshDatabaseAccessToken } from "./refreshTokens";
/**
 * NextAuthOptions
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: `https://accounts.spotify.com/authorize?scope=${spotifyScope}`,
    }),
  ],
  callbacks: {
    // Called on JWT creation
    // Arguments: user, account, profile, and isNewUser are only passed on a new session
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        console.log("In JWT Callback")
        return {
          accessToken: account.access_token,
          id: account.id,
          accessTokenExpires: account.expires_at ?? Date.now() / 1000,
          refreshToken: account.refresh_token,
        }
      }
      // Return previous token if the access token has not expired yet
      else if (!tokenExpired(token.accessTokenExpires)) {
        return token
      }
      const refreshedToken = await refreshAccessToken(token)
      return refreshedToken
    },
    // Called whenever a session is checked
    // Params:
    //    token is passed if using JWT's
    //    user is passed when using database persistence
    async session({ session, token, user }) {
      if (token) {
        session.accessToken = token.accessToken
        session.error = token.error
      } else if (user) {
        const spotify = await prisma.account.findFirst({
          where: { userId: user.id, provider: "spotify" },
        })
        if (tokenExpired(spotify?.expires_at ?? -1)) {
          refreshDatabaseAccessToken(user.id, session)
        }

        const token = await prisma.account.findFirst({
          where: {
            userId: user.id,
          },
        })

        const accessToken = token?.access_token ?? undefined
        session.accessToken = accessToken
        session.user.id = user.id
      }

      return session
    },
  },
}