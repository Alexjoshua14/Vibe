
export { default } from "next-auth/middleware"

/**
 * Require authentication for matching routes
 */
export const config = { matcher: ["/player", "/feed", "/player_server_actions"]}