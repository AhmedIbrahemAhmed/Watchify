import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { TmdbService } from '../../Core/Services/tmdb-service';

@Component({
  selector: 'app-filter-bar',
  imports: [FormsModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar {

  tmdbService = inject(TmdbService);
  cdr = inject(ChangeDetectorRef);
  genres: any[] = [];
  ratings = [
    { label: 'All Ratings', value: '' },
    { label: '9+', value: '9' },
    { label: '8+', value: '8' },
    { label: '7+', value: '7' }
  ];
  years = [
    { label: 'All Years', value: '' },
    { label: '2025 - 2026', value: '2022-2026' },
    { label: '2020 - 2024', value: '2020-2024' },
    { label: '2015 - 2019', value: '2015-2019' },
    { label: '2010 - 2014', value: '2010-2014' }
  ];

  @Output() filtersChanged = new EventEmitter();
  @Input() mediaType = '';
  search = '';

  genre = '';

  year = '';

  rating = '';

  ngOnInit() {
    this.tmdbService.loadGenres().subscribe(
      () => {
        console.log(this.mediaType);
        if (this.mediaType == 'movie') {
          this.genres = this.tmdbService.movieGenres;
        } else {
          this.genres = this.tmdbService.tvGenres;

        }

        this.cdr.detectChanges();
      }
    ); //if go to movies direct 
  }

  applyFilters() {
    console.log(this.genre);
    this.filtersChanged.emit({

      search: this.search,

      genre: this.genre,

      year: this.year,

      rating: this.rating

    });

  }

}
