import { Component, Input } from '@angular/core';
import { Review } from '../../Core/Interfaces/movie-model';

@Component({
  selector: 'app-movie-reviews',
  imports: [],
  templateUrl: './movie-reviews.html',
  styleUrl: './movie-reviews.css',
})
export class MovieReviews {
  @Input() reviews: Review[] = [];
}
