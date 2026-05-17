import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { Movie } from '../Interfaces/movie-model';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {

  private http = inject(HttpClient);

  private baseUrl = 'https://api.themoviedb.org/3';
  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZWNkODI3YzhmMjFlNDZkZjc5MWZlYjAyNTczYWQ1NCIsIm5iZiI6MTc3ODU5OTkxNy40NDQsInN1YiI6IjZhMDM0N2VkODNiNjA3YTk5NWQzYzEzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WF1k2UooYvpJqg0e4f3AQ9EgWuKFkIkeQE6XZVz9pZs';
  private headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

  movieGenres: any[] = [];
  tvGenres: any[] = [];

  loadGenres() {
    return forkJoin({
      movies: this.http.get<any>(`${this.baseUrl}/genre/movie/list`, { headers: this.headers }),
      tv: this.http.get<any>(`${this.baseUrl}/genre/tv/list`, { headers: this.headers })
    }).pipe(
      map(res => {
        this.movieGenres = res.movies.genres;
        this.tvGenres = res.tv.genres;
      })
    );
  }

  getAllTrending(page: number = 1) {
    return this.http.get<any>(
      `${this.baseUrl}/trending/all/day?page=${page}`,
      { headers: this.headers }
    ).pipe(map(response => {
      const media = response.results.filter(
        (item: any) => item.media_type !== 'person'
      );
      return media;
    })
    );
  }


  getAllMovies(page: number = 1, filters?: any) {

    let url =
      `${this.baseUrl}/discover/movie?language=en-US&page=${page}`;

    if (filters?.genre) {
      url += `&with_genres=${filters.genre}`;
    }

    if (filters?.year) {

      const [from, to] = filters.year.split('-').map((x: string) => x.trim());;
      url += `&primary_release_date.gte=${from}-01-01`;
      url += `&primary_release_date.lte=${to}-12-31`;  //not take year only
      console.log(from, to);
    }



    if (filters?.rating) {

      url += `&vote_average.gte=${filters.rating}`;
      console.log("rate")
    }

    if (filters?.search) {

      url =
        `${this.baseUrl}/search/movie?query=${filters.search}&language=en-US&page=${page}`;
      console.log("adskjfhj")
    }

    return this.http.get<any>(url, { headers: this.headers });

  }



  getAllTvShows(page: number = 1, filters?: any) {

    let url = `${this.baseUrl}/discover/tv?language=en-US&page=${page}`;

    if (filters?.genre) {
      url += `&with_genres=${filters.genre}`;
    }

    if (filters?.year) {
      const [from, to] = filters.year.split('-').map((x: string) => x.trim());
      url += `&first_air_date.gte=${from}-01-01`;
      url += `&first_air_date.lte=${to}-12-31`;
    }

    if (filters?.rating) {
      url += `&vote_average.gte=${filters.rating}`;
    }

    if (filters?.search) {
      url =
        `${this.baseUrl}/search/tv?query=${filters.search}&language=en-US&page=${page}`;
    }

    return this.http.get<any>(url, { headers: this.headers });
  }


  getGenresByType(item: any): string[] {
    const genreList = item.media_type === 'movie' ? this.movieGenres : this.tvGenres;

    if (!item.genre_ids) return [];

    return item.genre_ids.map((id: number) => genreList.find(g => g.id === id)?.name)
      .filter(Boolean);
  }
  // ---------------------------
  // 🔥 NEW: MEDIA DETAILS (MERGED FROM MovieService)
  // ---------------------------

  getMedia(id: string, type: 'movie' | 'tv'): Observable<any> {
    const url = `${this.baseUrl}/${type}/${id}`;
    return this.http.get<any>(url, { headers: this.headers });
  }
  getMediaReviews(id: string, type: 'movie' | 'tv'): Observable<any> {
    const url = `${this.baseUrl}/${type}/${id}/reviews`;
    return this.http.get<any>(url, { headers: this.headers });
  }
  getMediaSimilar(id: string, type: 'movie' | 'tv'): Observable<any> {
    const url = `${this.baseUrl}/${type}/${id}/recommendations`;
    return this.http.get<any>(url, { headers: this.headers });
  }
  getMediaCredits(id: string, type: 'movie' | 'tv'): Observable<any> {
    const url = `${this.baseUrl}/${type}/${id}/credits`;
    return this.http.get<any>(url, { headers: this.headers });
  }
  getMediaVideos(id: string, type: 'movie' | 'tv'): Observable<any> {
    const url = `${this.baseUrl}/${type}/${id}/videos`;
    return this.http.get<any>(url, { headers: this.headers });
  }
  getMediaSeasonDetails(tvId: string, seasonNumber: number): Observable<any> {
    const url = `${this.baseUrl}/tv/${tvId}/season/${seasonNumber}`;
    return this.http.get<any>(url, { headers: this.headers });
  }
  //function to fetch all data at once (details, reviews, similar, credits, videos) and map to internal model
  getMediaDetails(id: string, type: 'movie' | 'tv'): Observable<any> {
    return forkJoin({
      details: this.getMedia(id, type),
      reviews: this.getMediaReviews(id, type),
      similar: this.getMediaSimilar(id, type),
      credits: this.getMediaCredits(id, type),
      videos: this.getMediaVideos(id, type),
      seasons: type === 'tv' ? this.getMediaSeasonDetails(id, 1) : of(null)
    }).pipe(
      map(results => this.mapToInternalModel(results, type))
    );

  }

  // ---------------------------
  // MAPPING FUNCTION
  // ---------------------------
  private mapToInternalModel(res: any, type: 'movie' | 'tv'): Movie {
    console.log('Mapping response:', res.details.title || res.details.name, '| type:', type);
    return {
      id: res.details.id.toString(),
      title: type === 'movie' ? res.details.title : res.details.name,
      description: res.details.overview,
      backdropUrl: res.details.backdrop_path ? `https://image.tmdb.org/t/p/original${res.details.backdrop_path}` : '',
      posterUrl: res.details.poster_path ? `https://image.tmdb.org/t/p/w500${res.details.poster_path}` : '',
      rating: res.details.vote_average,
      year: res.details.release_date || res.details.first_air_date ? new Date(type === 'movie' ? res.details.release_date : res.details.first_air_date).getFullYear() : 0,
      duration: type === 'movie' ? `${res.details.runtime}m` : `${res.details.episode_run_time?.[0] || 0}m`,
      genres: res.details.genres?.map((g: any) => g.name) || [],
      director: res.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'N/A',
      writer: res.credits?.crew?.find((c: any) => c.job === 'Writer' || c.job === 'Screenplay')?.name || 'N/A',
      studio: res.details.production_companies?.[0]?.name || 'N/A',
      budget: res.details.budget ? `$${(res.details.budget / 1000000).toFixed(1)}M` : 'N/A',
      cast: res.credits?.cast?.slice(0, 6).map((c: any) => ({
        name: c.name,
        role: c.character,
        imageUrl: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'assets/images/default-avatar.png'
      })) || [],
      similarMovies: res.similar?.results?.slice(0, 6).map((s: any) => ({
        id: s.id.toString(),
        title: type === 'movie' ? s.title : s.name,
        rating: s.vote_average,
        year: new Date(type === 'movie' ? s.release_date : s.first_air_date).getFullYear(),
        posterUrl: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : '',
        genres: res.details.genres?.map((g: any) => g.name) || [] // Map genres from main details
      })) || [],
      reviews: res.reviews?.results?.slice(0, 3).map((r: any) => ({
        user: r.author,
        avatar: r.author_details?.avatar_path?.includes('http') ? r.author_details.avatar_path.substring(1) : `https://image.tmdb.org/t/p/w185${r.author_details?.avatar_path}`,
        rating: r.author_details?.rating || 5,
        comment: r.content,
        date: r.created_at
      })) || [],
      trailerUrl: this.extractYoutubeUrl(res.videos?.results),
      isSeries: type === 'tv',
      streamUrl: 'https://www.youtube.com/embed/Aq5WXmQQooo', // Placeholder stream URL, as TMDB doesn't provide actual streaming links
      seasons: type === 'tv' ? res.details.seasons?.map((s: any) => ({
        id: s.id.toString(),
        title: s.name,
        year: s.air_date
          ? new Date(s.air_date).getFullYear()
          : 0,
        seasonNumber: s.season_number,
        episode_count: s.episode_count,

        // only inject episodes for season 1
        episodes:
          s.season_number === 1
            ? res.seasons?.episodes?.map((e: any) => ({
                id: e.id.toString(),
                title: e.name,
                duration: `${e.runtime || 0}m`,
                order: e.episode_number,
                streamUrl:
                  'https://www.youtube.com/embed/Aq5WXmQQooo'
              })) || []
            : []
      })) || []: [],
      currentEpisodeIndex: type === 'tv' ? 0 : undefined
    };
  }
 

  // ---------------------------
  // TRAILER
  // ---------------------------
  private extractYoutubeUrl(results: any[]): string {
    const trailer = results?.find(
      (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';
  }


}
