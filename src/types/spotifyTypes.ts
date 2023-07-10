
export interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyArtist {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyAlbum {
  album_type: string;
  artists: SpotifyArtist[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface SpotifyItem {
  id: number;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  href: string;
  uri: string;
  type: string;
  popularity: number;
  explicit: boolean;
}

export interface SpotifyItemBrief {
  id: number;
  name: string;
  artists: string[];
  album: string;
  duration_ms: number;
  href: string;
  release_date: string;
  image: {
    height: number;
    url: string;
    width: number;
  };
}

/* API Response formats */

export interface SpotifyTopTracksResponse {
  items: SpotifyItem[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next?: string;
  previous?: string;
}