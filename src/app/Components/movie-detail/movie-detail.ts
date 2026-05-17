import { Component, inject } from '@angular/core';
import { MovieHero } from "../movie-hero/movie-hero";
import { MovieInfo } from "../movie-info/movie-info";
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../Core/Interfaces/movie-model';
import { MovieReviews } from "../movie-reviews/movie-reviews";
import { MovieTrailer } from "../movie-trailer/movie-trailer";
import { MovieSimilar } from "../movie-similar/movie-similar";
import { MovieService } from '../../Core/Services/movieService';
import { VideoPlayer } from "../video-player/video-player";

@Component({
  selector: 'app-movie-detail',
  imports: [MovieHero, MovieInfo, MovieReviews, MovieTrailer, MovieSimilar, VideoPlayer],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css',
})
export class MovieDetail {
  showPlayer = false;
  // true for now - in a real app, this would come from an AuthService or similar
  isUserSubscribed = true;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  currentMovie!: Movie;
  // constructor(private authService: AuthService, private router: Router) {
  //   // Check subscription status from your service
  //   this.isUserSubscribed = this.authService.getUserSubscriptionStatus();
  // }
  ngOnInit() {
  // Use the observable paramMap to handle navigation to similar movies
    this.route.paramMap.subscribe(params => {
      this.fetchMovieDetails(params.get('id'));
    });
}

  fetchMovieDetails(id: string | null) {
    const mediaId = id || '1';
    // 1. Get the mediaType from route data ('movie' or 'tv')
    const type = this.route.snapshot.data['mediaType'] as 'movie' | 'tv';

    // 2. Set Static Data immediately for testing/instant loading
    this.currentMovie = {
      id: mediaId,
      title: type === 'movie' ? 'The Nebula Protocol' : 'Nebula: The Series',
      rating: 8.9,
      description: 'In a future where memories can be harvested...',
      backdropUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2070',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
      director: 'Denis Villeneuve',
      studio: 'Orion Pictures',
      genres: ['Sci-Fi', 'Thriller'],
      year: 2024,
      duration: '2h 15m',
      budget: '$150 million',
      writer: 'Denis Villeneuve',
      cast: [
        { name: 'Elena Vance', role: 'Commander', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' },
        { name: 'Marcus Thorne', role: 'Specialist', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' }
      ],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      reviews: [],
      similarMovies: [],
      streamUrl: 'https://www.youtube.com/embed/Aq5WXmQQooo',
      isSeries: type === 'tv',
      currentEpisodeIndex: type === 'tv' ? 0 : undefined,
      episodes: type === 'tv' ? [
        { id: 'e1', title: 'The Erasure', streamUrl: 'https://www.youtube.com/embed/Aq5WXmQQooo', order: 1 },
        { id: 'e2', title: 'Fragmented', streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', order: 2 }
      ] : []
    };

    // 3. Call the TMDB Service (Overwrites static data when API responds)
    this.movieService.getMediaDetails(mediaId, type).subscribe({
      next: (data) => {
        // Preserve your streamUrl/episodes if TMDB doesn't provide them
        this.currentMovie = { 
          ...data, 
          streamUrl: this.currentMovie.streamUrl,
          episodes: data.isSeries ? this.currentMovie.episodes : [] 
        };
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.warn('API Error, keeping static test data:', err);
        // We don't clear currentMovie here so the static data stays visible
      }
    });
  }
  handleWatchNow() {
    if (this.isUserSubscribed) {
      this.showPlayer = true;
      // Smooth scroll to the player
      setTimeout(() => {
        document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // If not subscribed, redirect to pricing or show a modal
      alert('Subscription Required! Redirecting to plans...');
      this.router.navigate(['/watchify/pricing']);
    }
  }
}
