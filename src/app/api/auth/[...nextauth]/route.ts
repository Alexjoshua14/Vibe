import NextAuth, { DefaultSession, Account as NextAuthAccount} from "next-auth";
import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { spotifyScope } from "@/constants/spotify";

// async function refreshAccessToken(token: NextAuthJWT): Promise<JWT> { 
//   try {
//     const basicAuth = Buffer.from(`${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`).toString(
//       'base64'
//     )
//     const { data } = await axios.post(
//       process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN_URL!,
//       {
//         grant_type: 'refresh_token',
//         refresh_token: token.refreshToken,
//       },
//       {
//         headers: {
//           Authorization: `Basic ${basicAuth}`,
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       }
//     )
//     return {
//       ...token,
//       accessToken: data.access_token,
//       accessTokenExpires: Date.now() + data.expires_in * 1000,
//     }
//   } catch (error) {
//     return {
//       ...token,
//       error: 'RefreshAccessTokenError',
//     }
//   }
// }

async function refreshAccessToken(token) {
  try {
    const url =
      process.env.NEXT_PUBLIC_SPOTIFY_TOKEN_URL!;
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      
  } catch (error) {
    console.log(error);
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
      authorization: `https://accounts.spotify.com/authorize?scope=${spotifyScopes}`,
    }),
  ],
  callbacks: {
    // Arguments: user, account, profile, and isNewUser are only passed on a new session
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.id;
        token.accessTokenExpires = account.expires_at * 1000;
        token.refreshToken = account.refresh_token;
      }

      console.log("TOKEN: " + token);
      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
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