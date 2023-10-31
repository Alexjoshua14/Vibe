import { 
  Image, 
  SpotifyAlbum, 
  SpotifyArtist, 
  SpotifyItem, 
  SpotifyItemBrief, 
  SpotifyItemWrapper
} from '@/lib/validators/spotify'

// Sample Image data
export const sampleImage: Image = {
  height: 300,
  url: 'https://example.com/image.jpg',
  width: 400,
};

export const sampleImage2: Image = {
  height: 500,
  url: 'https://example.com/image2.jpg',
  width: 600,
};

// Sample SpotifyArtist data
export const sampleArtist: SpotifyArtist = {
  href: 'https://example.com/artist',
  id: 'artist123',
  name: 'Sample Artist',
  type: 'artist',
  uri: 'spotify:artist:artist123',
};

export const sampleArtist2: SpotifyArtist = {
  href: 'https://example.com/artist2',
  id: 'artist456',
  name: 'Another Artist',
  type: 'artist',
  uri: 'spotify:artist:artist456',
};

// Sample SpotifyAlbum data
export const sampleAlbum: SpotifyAlbum = {
  album_type: 'album',
  artists: [sampleArtist, sampleArtist],
  external_urls: {
    spotify: 'https://example.com/album',
  },
  href: 'https://example.com/album',
  id: 'album123',
  images: [sampleImage, sampleImage],
  name: 'Sample Album',
  release_date: '2023-01-01',
  total_tracks: 10,
  type: 'album',
  uri: 'spotify:album:album123',
};

export const sampleAlbum2: SpotifyAlbum = {
  album_type: 'album',
  artists: [sampleArtist2],
  external_urls: {
    spotify: 'https://example.com/album2',
  },
  href: 'https://example.com/album2',
  id: 'album456',
  images: [sampleImage2],
  name: 'Another Album',
  release_date: '2023-02-15',
  total_tracks: 12,
  type: 'album',
  uri: 'spotify:album:album456',
};

// Sample SpotifyItem data
export const sampleItem: SpotifyItem = {
  id: '12345',
  name: 'Sample Song',
  artists: [sampleArtist, sampleArtist],
  album: sampleAlbum,
  duration_ms: 180000, // 3 minutes
  href: 'https://example.com/song',
  uri: 'spotify:track:item123',
  type: 'track',
  popularity: 80,
  explicit: false,
};

export const sampleItem2: SpotifyItem = {
  id: '987654',
  name: 'Another Song',
  artists: [sampleArtist2],
  album: sampleAlbum2,
  duration_ms: 240000, // 4 minutes
  href: 'https://example.com/song2',
  uri: 'spotify:track:item456',
  type: 'track',
  popularity: 92,
  explicit: true,
};

export const sampleItemBrief: SpotifyItemBrief = {
  id: sampleItem.id,
  name: sampleItem.name,
  artists: sampleItem.artists.map((artist) => artist.name),
  album: sampleItem.album.name,
  duration_ms: sampleItem.duration_ms,
  href: sampleItem.href,
  release_date: sampleItem.album.release_date,
  image: sampleItem.album.images[0]
}

export const sampleItemBrief2: SpotifyItemBrief = {
  id: sampleItem2.id,
  name: sampleItem2.name,
  artists: sampleItem2.artists.map((artist) => artist.name),
  album: sampleItem2.album.name,
  duration_ms: sampleItem2.duration_ms,
  href: sampleItem2.href,
  release_date: sampleItem2.album.release_date,
  image: sampleItem2.album.images[0]
}

// Sample SpotifyItemWrapper
export const sampleItemWrapper: SpotifyItemWrapper = {
  items: [
    sampleItem, sampleItem2
  ],
}
