import { Session, TokenSet } from "next-auth"
import { JWT } from "next-auth/jwt"

import { tokenURL } from "@/constants/spotify"
import prisma from "@/lib/prisma"

import { tokenExpirationFromNow } from "../helper"

/**
 * Attempt to refresh access token
 * If unable to refresh, return original token with error
 *
 * @param token JWT token
 * @returns JWT token with refreshed access token
 * @throws Error if unable to refresh access token
 */
export async function refreshAccessToken(token: JWT) {
  try {
    const res = await fetch(tokenURL, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
      method: "POST",
    })

    const refreshedTokens = await res.json()

    if (!res.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: tokenExpirationFromNow(refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.log("Error refreshing access token: " + error)
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
export async function refreshDatabaseAccessToken(
  userId: string,
  session: Session,
) {
  // Grab user's spotify account information from database
  try {
    const spotify = await prisma.account.findFirst({
      where: { userId: userId, provider: "spotify" },
    })

    if (!spotify?.refresh_token) {
      throw new Error("No refresh token in database..")
    }

    // Request a refreshed access token from Spotify
    const res = await fetch(tokenURL, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: spotify?.refresh_token,
      }),
      method: "POST",
    })

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
        refresh_token: tokens.refresh_token,
      },
      where: {
        provider_providerAccountId: {
          provider: "spotify",
          providerAccountId: spotify.providerAccountId,
        },
      },
    })
  } catch (err) {
    // On error, log to console and set error message on session object
    console.error(`Error trying to refresh accces token: ${err}`)
    session.error = "RefreshAccessTokenError"
  }
}
