import NextAuth, { DefaultSession, Account as NextAuthAccoun, NextAuthOptions, Account} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";
import { tokenExpirationFromNow, tokenExpired } from "@/utilities/helper";
import { spotifyScope, tokenURL } from "@/constants/spotify"; 

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

/**
 * NextAuthOptions
 * 
 * @see https://next-auth.js.org/configuration/options
 */
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
}

/**
 * Export handler as GET and POST
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }