import { z } from "zod"

export const SongInformationVariantSchema = z.enum([
  "main",
  "secondary",
  "modal",
])

export type SongInformationVariant = z.infer<
  typeof SongInformationVariantSchema
>

export const ImageSchema = z.object({
  height: z.number(),
  url: z.string().url(),
  width: z.number(),
})

export type Image = z.infer<typeof ImageSchema>

export const SpotifyArtistSchema = z.object({
  href: z.string(),
  id: z.string(),
  name: z.string(),
  type: z.string(),
  uri: z.string(),
  external_urls: z
    .object({
      spotify: z.string(),
    })
    .optional(),
})

export type SpotifyArtist = z.infer<typeof SpotifyArtistSchema>

export const SpotifyAlbumSchema = z.object({
  album_type: z.string(),
  artists: z.array(SpotifyArtistSchema),
  external_urls: z.object({
    spotify: z.string(),
  }),
  href: z.string(),
  id: z.string(),
  images: z.array(ImageSchema),
  name: z.string(),
  release_date: z.string(),
  total_tracks: z.number(),
  type: z.string(),
  uri: z.string(),
})

export type SpotifyAlbum = z.infer<typeof SpotifyAlbumSchema>

export const SpotifyItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(SpotifyArtistSchema),
  album: SpotifyAlbumSchema,
  albumId: z.optional(z.string()),
  duration_ms: z.number(),
  href: z.string(),
  uri: z.string(),
  type: z.string(),
  explicit: z.boolean(),
  popularity: z.number(),
  avilable_markets: z.array(z.string()).optional(),
  updatedAt: z.optional(z.number()),
})

export type SpotifyItem = z.infer<typeof SpotifyItemSchema>

export const SpotifyItemWrapperSchema = z.object({
  items: z.array(SpotifyItemSchema),
})

export type SpotifyItemWrapper = z.infer<typeof SpotifyItemWrapperSchema>

export const SpotifyItemBriefSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(z.string()),
  album: z.string(),
  duration_ms: z.number(),
  href: z.string(),
  release_date: z.string(),
  image: ImageSchema,
})

export type SpotifyItemBrief = z.infer<typeof SpotifyItemBriefSchema>

export const CurrentlyPlayingSchema = z.object({
  timestamp: z.optional(z.number()),
  updatedAt: z.optional(z.number()),
  progress_ms: z.number(),
  song: z.optional(SpotifyItemSchema),
  item: z.optional(SpotifyItemSchema),
  currently_playing_type: z.string(),
  is_playing: z.boolean(),
  id: z.optional(z.string()),
  userId: z.optional(z.string()),
})

export type CurrentlyPlaying = z.infer<typeof CurrentlyPlayingSchema>

export const CurrentlyPlayingResponseSchema = CurrentlyPlayingSchema.extend({
  context: z.object({
    external_urls: z.object({
      spotify: z.string(),
    }),
    href: z.string(),
    type: z.string(),
    uri: z.string(),
  }),
})

export type CurrentlyPlayingResponse = z.infer<
  typeof CurrentlyPlayingResponseSchema
>

export const SpotifyTracksSchema = SpotifyItemWrapperSchema.extend({
  href: z.string(),
  items: z.array(SpotifyItemSchema),
  limit: z.number(),
  next: z.string(),
  offset: z.number(),
  total: z.number(),
  previous: z.optional(z.string()),
})

export type SpotifyTracks = z.infer<typeof SpotifyTracksSchema>

export const SpotifyTopTracksResponseSchema = z.object({
  items: z.array(SpotifyItemSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  href: z.string().url(),
  next: z.nullable(z.string().url()),
  previous: z.nullable(z.string().url()),
})

export type SpotifyTopTracksResponse = z.infer<
  typeof SpotifyTopTracksResponseSchema
>

export const PlaybackStateResponseSchema = z.object({
  device: z.object({
    id: z.string(),
    is_active: z.boolean(),
    is_private_session: z.boolean(),
    is_restricted: z.boolean(),
    name: z.string(),
    type: z.string(),
    volume_percent: z.number(),
  }),
  repeat_state: z.string(),
  shuffle_state: z.boolean(),
  context: z.optional(
    z.object({
      type: z.string(),
      href: z.string(),
      external_urls: z.object({
        spotify: z.string(),
      }),
      uri: z.string(),
    }),
  ),
  timestamp: z.number(),
  progress_ms: z.number(),
  is_playing: z.boolean(),
  currently_playing_type: z.string(),
  item: SpotifyItemSchema,
})

export const TrackResponseSchema = z.object({
  album: SpotifyAlbumSchema,
  artists: z.array(SpotifyArtistSchema),
  available_markets: z.array(z.string()),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_ids: z.object({
    isrc: z.string(),
  }),
  external_urls: z.object({
    spotify: z.string(),
  }),
  href: z.string(),
  id: z.string(),
  is_playable: z.boolean(),
  is_local: z.boolean(),
  name: z.string(),
  popularity: z.number(),
  preview_url: z.string(),
  track_number: z.number(),
  type: z.string(),
  uri: z.string(),
})

export type TrackResponse = z.infer<typeof TrackResponseSchema>

export type PlaybackStateResponse = z.infer<typeof PlaybackStateResponseSchema>

export const SpotifySearchResponseSchema = z.object({
  tracks: SpotifyTracksSchema,
})

export type SpotifySearchResponse = z.infer<typeof SpotifySearchResponseSchema>

export const SpotifySearchResponseParsed = z.array(SpotifyItemSchema)
export type SpotifySearch = z.infer<typeof SpotifySearchResponseParsed>
