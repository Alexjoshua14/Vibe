import { z } from 'zod'
import { UserSchema } from './user'
import { SpotifyItemSchema } from './spotify'

export const PostDataSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  user: UserSchema,
  createdAt: z.string(),
  updatedAt: z.optional(z.string()),
  item: SpotifyItemSchema
})

export type PostData = z.infer<typeof PostDataSchema>