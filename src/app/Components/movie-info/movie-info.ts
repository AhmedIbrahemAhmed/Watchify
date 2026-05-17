import { Component, Input } from '@angular/core';
import { Movie } from '../../Core/Interfaces/movie-model';

@Component({
  selector: 'app-movie-info',
  imports: [],
  templateUrl: './movie-info.html',
  styleUrl: './movie-info.css',
})
export class MovieInfo {
  @Input() movie!: Movie;
}
