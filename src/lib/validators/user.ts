import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  spotifyProfile: z.string()
})

export type User = z.infer<typeof UserSchema>