// import { SpotifyItem } from './spotifyTypes';

interface User {
  id: number
  name: string
  username: string
  spotifyProfile: string
}

interface PostData {
  id: number
  title: string
  body: string
  user: User
  createdAt: string
  updatedAt?: string
  item: SpotifyItem
}
