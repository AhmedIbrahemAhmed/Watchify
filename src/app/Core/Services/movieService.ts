// movie.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Movie } from '../Interfaces/movie-model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiKey = 'YOUR_TMDB_KEY';
  private baseUrl = 'https://api.themoviedb.org/3';
  private http = inject(HttpClient);
  getMediaDetails(id: string, type: 'movie' | 'tv'): Observable<Movie> {
    const url = `${this.baseUrl}/${type}/${id}?api_key=${this.apiKey}&append_to_response=videos,credits,reviews,similar`;
    
    return this.http.get<any>(url).pipe(
      map((res: any) => this.mapToInternalModel(res, type))
    );
  }

  private mapToInternalModel(res: any, type: 'movie' | 'tv'): Movie {
    return {
      id: res.id.toString(),
      title: type === 'movie' ? res.title : res.name,
      description: res.overview,
      backdropUrl: res.backdrop_path ? `https://image.tmdb.org/t/p/original${res.backdrop_path}` : '',
      posterUrl: res.poster_path ? `https://image.tmdb.org/t/p/w500${res.poster_path}` : '',
      rating: res.vote_average,
      // Fix: Add a check to prevent "getFullYear of undefined" if date is missing
      year: res.release_date || res.first_air_date ? new Date(type === 'movie' ? res.release_date : res.first_air_date).getFullYear() : 0,
      
      // TMDB provides runtime in minutes (Movie) or episode_run_time array (TV)
      duration: type === 'movie' ? `${res.runtime}m` : `${res.episode_run_time?.[0] || 0}m`,
      
      genres: res.genres ? res.genres.map((g: any) => g.name) : [],
      
      // Technical Credits (mapping TMDB Crew to your Director/Writer fields)
      director: res.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'N/A',
      writer: res.credits?.crew?.find((c: any) => c.job === 'Writer' || c.job === 'Screenplay')?.name || 'N/A',
      studio: res.production_companies?.[0]?.name || 'N/A',
      budget: res.budget ? `$${(res.budget / 1000000).toFixed(1)}M` : 'N/A',

      cast: res.credits?.cast?.slice(0, 6).map((c: any) => ({
        name: c.name,
        role: c.character,
        imageUrl: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'assets/images/default-avatar.png'
      })) || [],

      // Mapping the Similar Movies section
      similarMovies: res.similar?.results?.slice(0, 6).map((s: any) => ({
        id: s.id.toString(),
        title: type === 'movie' ? s.title : s.name,
        rating: s.vote_average,
        year: new Date(type === 'movie' ? s.release_date : s.first_air_date).getFullYear(),
        posterUrl: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : '',
        genres: [] // TMDB only sends genre IDs in similar results, you can map them if needed
      })) || [],

      // Mapping the Reviews
      reviews: res.reviews?.results?.slice(0, 3).map((r: any) => ({
        user: r.author,
        avatar: r.author_details?.avatar_path?.includes('http') 
                ? r.author_details.avatar_path.substring(1) 
                : `https://image.tmdb.org/t/p/w185${r.author_details?.avatar_path}`,
        rating: r.author_details?.rating || 5,
        comment: r.content,
        date: r.created_at
      })) || [],

      trailerUrl: this.extractYoutubeUrl(res.videos?.results),
      isSeries: type === 'tv',
      streamUrl: '' // This will be handled by your logic (handleWatchNow)
    };
  }

  private extractYoutubeUrl(results: any[]): string {
    const trailer = results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';
  }
}
