import NextAuth, { DefaultSession, Account as NextAuthAccount} from "next-auth";
import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { spotifyScope } from "@/constants/spotify";
import { JWT } from "next-auth/jwt";
import { Account } from "next-auth";

/*
* Convert current time to seconds and add token expiration time to it
*/
const tokenExpirationFromNow = (time: number) => {
  return Math.floor(Date.now() / 1000 + time);
}

const tokenExpired = (expires_at?: number) => {
  return (expires_at ?? 0) < Date.now() / 1000;
}

async function refreshAccessToken(token: JWT) {
  console.log("Refreshing access token");
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SPOTIFY_TOKEN_URL!, {
      headers: { "Content-Type": "application/x-www-form-urlencoded"},
      body: 
       new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
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

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
      authorization: `https://accounts.spotify.com/authorize?scope=${spotifyScope}`,
    }),
  ],
  callbacks: {
    // Arguments: user, account, profile, and isNewUser are only passed on a new session
    async jwt({ token, account }: {token: JWT, account: Account | null}) {
      if (account) {
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
    // Access token needs to be explicitly declared to be made available
    // If using a database, may want to accept user argument and persist user.id
    async session({ session, token }) {
      
      session.accessToken = token.accessToken;
      session.error = token.error;
      
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }