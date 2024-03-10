import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server"

import { rateLimiter } from "@/lib/rate-limiting/rate-limiter"

import { stackMiddlewares } from "./middlewares/stackMiddlewares"
import { MiddlewareFactory } from "./middlewares/types"

export { default } from "next-auth/middleware"

/**
 * Require authentication for matching routes
 */
export const config = {
  matcher: ["/player", "/feed", "/player_server_actions"],
}

/**
 * Rate limiting Spotify API calls
 */
export async function middleware(req: NextRequest) {
  logRequest(req)

  const ip = req.ip ?? "127.0.0.1"
  const env = process.env.NODE_ENV
  if (env === "test" || env === "development") return NextResponse.next()

  try {
    // rate limit based on ip address
    console.debug("Running rate limiter")
    const { success } = await rateLimiter.limit(ip)
    // const success = true // Removing limiter during development
    console.log("Middleware: " + success)

    return success
      ? NextResponse.next()
      : new NextResponse("Requests are coming in too fast!")
  } catch (err) {
    console.error(err)
    return new NextResponse(
      "Sorry, something went wrong with processing your message. Please try again later. #middleware_error",
    )
  }
}

// export function chain(functions: MiddlewareFactory[], index = 0): NextMiddleware {
//   const current = functions[index]

//   if (current) {
//     const next = chain(functions, index + 1)
//     return current(next)
//   }
//   return () => NextResponse.next()
// }

const logRequest = (req: NextRequest) => {
  try {
  console.log("Request: " + req.url)
  console.log("Method: " + req.method)
  
  } catch (err) {
    console.log("Middleware request logging failed: " + err)
  }
  
  NextResponse.next()
}


// const withLogging: MiddlewareFactory = (next) => {
//   return async (request: NextRequest, _next: NextFetchEvent) => {
//     console.log("Request: " + request.url)
//     console.log("Method: " + request.method)

//     return next(request, _next)
//   }
// }

// export async function middleware(req: NextRequest) {
//   chain([withLogging])
// }