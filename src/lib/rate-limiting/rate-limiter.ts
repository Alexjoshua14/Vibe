import { Ratelimit } from "@upstash/ratelimit"

import { redis } from "./redis"

/**
 * Rate limit should be currently set below Spotify API's rate limit.
 *
 * The actual Spotify API is rate limited based on a 30 sec window.
 * There are no concrete number of requests allowed provided but
 * the spotify dev community seems to believe its around 180 req/min
 */
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "30 s"),
  prefix: "@upstash/ratelimit",
})
