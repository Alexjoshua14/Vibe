type SongInformationVariant = "main" | "secondary" | "modal"

interface SpotifyImage {
  height: number
  url: string
  width: number
}

interface SpotifyArtist {
  href: string
  id: string
  name: string
  type: string
  uri: string
}

interface SpotifyAlbum {
  album_type: string
  artists: SpotifyArtist[]
  external_urls: { spotify: string }
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  release_date: string
  total_tracks: number
  type: string
  uri: string
}

interface SpotifyItem {
  id: number
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  duration_ms: number
  href: string
  uri: string
  type: string
  popularity: number
  explicit: boolean
}

interface SpotifyItemWrapper {
  items: SpotifyItem[]
}

interface SpotifyItemBrief {
  id: number
  name: string
  artists: string[]
  album: string
  duration_ms: number
  href: string
  release_date: string
  image: SpotifyImage
}

interface CurrentlyPlaying {
  timestamp: number
  progress_ms: number
  item: SpotifyItem
  currently_playing_type: string
  is_playing: boolean
}

interface CurrentlyPlayingResponse extends CurrentlyPlaying {
  context: {
    external_urls: {
      spotify: string
    }
    href: string
    type: string
    uri: string
  }
}

interface SpotifyTracks extends SpotifyItemWrapper {
  href: string
  items: SpotifyItem[]
  limit: number
  next: string
  offset: number
  previous?: string
  total: number
}

/* API Response types */

interface SpotifyTopTracksResponse {
  items: SpotifyItem[]
  total: number
  limit: number
  offset: number
  href: string
  next?: string
  previous?: string
}

interface PlaybackStateResponse {
  device: {
    id: string
    is_active: boolean
    is_private_session: boolean
    is_restricted: boolean
    name: string
    type: string
    volume_percent: number
  }
  repeat_state: string
  shuffle_state: boolean
  context?: {
    type: string
    href: string
    external_urls: {
      spotify: string
    }
    uri: string
  }
  timestamp: number
  progress_ms: number
  is_playing: boolean
  currently_playing_type: string
  item: SpotifyItem
}

interface SpotifySearchResponse {
  tracks: SpotifyTracks
}
