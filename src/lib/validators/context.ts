
import { z } from 'zod'

import { CurrentlyPlayingSchema } from './spotify'

export const StatusSchema = z.enum(['IDLE', 'HOST', 'MEMBER'])
export type Status = z.infer<typeof StatusSchema>

export const SearchSchema = z.object({
  searching: z.boolean(),
})

export const ContextSchema = z.object({
  currentlyPlaying: CurrentlyPlayingSchema,
  status: StatusSchema,
  search: SearchSchema,
})

export type Context = z.infer<typeof ContextSchema>
