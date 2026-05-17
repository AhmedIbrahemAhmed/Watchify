import { Component, Input } from '@angular/core';
import { SimilarMovie } from '../../Core/Interfaces/movie-model';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-movie-similar',
  imports: [RouterModule],
  templateUrl: './movie-similar.html',
  styleUrl: './movie-similar.css',
})
export class MovieSimilar {
  @Input() movies: SimilarMovie[] = [];
  @Input() type: 'Movies' | 'TvShows' = 'Movies';
}
