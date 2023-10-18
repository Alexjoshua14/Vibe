import { rateLimiter } from "@/lib/rate-limiting/rate-limiter"
import { NextRequest, NextResponse } from "next/server"

export { default } from "next-auth/middleware"

/**
 * Require authentication for matching routes
 */
export const config = { matcher: ["/player", "/feed", "/player_server_actions"]}

/**
 * Rate limiting Spotify API calls
 */
export async function middleware(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1'
  const env = process.env.NODE_ENV
  if (env === 'test' || env === 'development')
    return NextResponse.next()
    


  try {
    // rate limit based on ip address
    console.log("Running rate limiter")
    const { success } = await rateLimiter.limit(ip)
    // const success = true // Removing limiter during development
    console.log("Middleware: " + success);

    return success ?
      NextResponse.next()
      : new NextResponse('Requests are coming in too fast!');

  } catch (err) {
    return new NextResponse("Sorry, something went wrong with processing your message. Please try again later. #middleware_error")
  }
}