import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';

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

}
