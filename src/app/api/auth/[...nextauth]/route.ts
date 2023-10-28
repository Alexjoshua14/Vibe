import NextAuth, { DefaultSession, Account as NextAuthAccoun, NextAuthOptions, Account, TokenSet, Session} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";
import { tokenExpirationFromNow, tokenExpired } from "@/utilities/helper";
import { spotifyScope, tokenURL } from "@/constants/spotify"; 
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";

/**
 * Attempt to refresh access token
 * If unable to refresh, return original token with error
 * 
 * @param token JWT token
 * @returns JWT token with refreshed access token
 * @throws Error if unable to refresh access token
 */
async function refreshAccessToken(token: JWT) {
  try {
    const res = await fetch(tokenURL, {
      headers: { "Content-Type": "application/x-www-form-urlencoded"},
      body: 
       new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
       }),
       method: "POST",
    });

    const refreshedTokens = await res.json();

    if (!res.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: tokenExpirationFromNow(refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
      
  } catch (error) {
    console.log("Error refreshing access token: " + error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

/**
 * Attempt to refresh access token
 * If unable to refresh, set error field on session object
 * 
 * @param userId User's id
 * @param session Session object from Auth.js Session callback
 */
async function refreshDatabaseAccessToken(userId: string, session: Session) {
  // Grab user's spotify account information from database
  try {
    const spotify = await prisma.account.findFirst({
      where: { userId: userId, provider: 'spotify' }
    })

    if (!spotify?.refresh_token) {
      throw new Error("No refresh token in database..")
    }

    // Request a refreshed access token from Spotify
    const res = await fetch(tokenURL, {
      headers: { "Content-Type": "application/x-www-form-urlencoded"},
      body: 
       new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: spotify?.refresh_token,
       }),
       method: "POST",
    });

    // Parse response and check for error
    const tokens: TokenSet = await res.json()
    if (!res.ok) {
      throw tokens
    }

    // Update tokens and expiration time in database
    await prisma.account.update({
      data: {
        access_token: tokens.access_token,
        expires_at: tokens.expires_at,
        refresh_token: tokens.refresh_token
      },
      where: {
        provider_providerAccountId: {
          provider: 'spotify',
          providerAccountId: spotify.providerAccountId
        }
        
      }
    })

  } catch (err) {
    // On error, log to console and set error message on session object
    console.error(`Error trying to refresh accces token: ${err}`)
    session.error = "RefreshAccessTokenError"
  }
}

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
    async jwt({ token, account }: {token: JWT, account: Account | null}) {
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
        return token;
      }
      const refreshedToken = await refreshAccessToken(token);
      return refreshedToken;
    },
    // Called whenever a session is checked
    // Params:
    //    token is passed if using JWT's
    //    user is passed when using database persistence
    async session({ session, token, user }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.error = token.error
      } else if (user) {

        const spotify = await prisma.account.findFirst({
          where: { userId: user.id, provider: 'spotify' }
        })
        if (tokenExpired(spotify?.expires_at ?? -1)) {
          refreshDatabaseAccessToken(user.id, session)
        }

        const token = await prisma.account.findFirst({
          where: {
            userId: user.id
          },
        });

        const accessToken = token?.access_token ?? undefined; 
        session.accessToken = accessToken
        session.user.id = user.id
      }
      
      return session;
    }
  },
}

/**
 * Export handler as GET and POST
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }