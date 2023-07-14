import { SpotifyItem } from './spotifyTypes';

export interface User {
  id: number;
  name: string;
  username: string;
  spotifyProfile: string;
}

export interface PostData {
  id: number;
  title: string;
  body: string;
  user: User;
  createdAt: string;
  updatedAt?: string;
  item: SpotifyItem;
}