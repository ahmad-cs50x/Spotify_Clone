// types/index.ts
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSec: number;
  cover: string;
  url: string;
  isLocal: boolean;
  fileName?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}