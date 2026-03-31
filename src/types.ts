export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  duration: number;
}

export interface Point {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
