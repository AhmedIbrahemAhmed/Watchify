// movie.model.ts
export interface Actor {
  name: string;
  role: string;
  imageUrl: string;
}
export interface Review {
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SimilarMovie {
  id: string;
  title: string;
  rating: number;
  year: number;
  posterUrl: string;
  genres: string[];
}
export interface Episode {
  id: string;
  title: string;
  streamUrl: string;
  order: number;
}
export interface Movie {
  id: string;
  title: string;
  rating: number;
  year: number;
  duration: string;
  description: string;
  genres: string[];
  director: string;
  writer: string;
  studio: string;
  budget: string;
  backdropUrl: string;
  posterUrl: string;
  cast: Actor[];
  trailerUrl: string; // YouTube embed URL
  reviews: Review[];
  similarMovies: SimilarMovie[];
  streamUrl?: string;
  isSeries?: boolean;
  episodes?: Episode[];
  currentEpisodeIndex?: number;
}