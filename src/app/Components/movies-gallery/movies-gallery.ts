import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MediaCard } from '../media-card/media-card';
import { FilterBar } from "../filter-bar/filter-bar";
import { Pagination } from '../pagination/pagination';
import { TmdbService } from '../../Core/Services/tmdb-service';

@Component({
  selector: 'app-movies-gallery',
  imports: [MediaCard, FilterBar, Pagination],
  templateUrl: './movies-gallery.html',
  styleUrl: './movies-gallery.css',
})
export class MoviesGallery {

  tmdbService = inject(TmdbService);
  cdr = inject(ChangeDetectorRef);

  movies: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  filters: any = {};
  mediaType = 'movie';

  ngOnInit(): void {
    this.loadMovies(this.currentPage);
  }

  loadMovies(page: number, filters?: any) {

    this.tmdbService.getAllMovies(page, filters).subscribe(

      (res: any) => {

        this.movies = res.results;

        this.currentPage = res.page;

        this.totalPages = res.total_pages;

        this.generatePagination();

        this.cdr.detectChanges();
        console.log(this.movies);

      });



  }


  generatePagination() {

    const visiblePages = 5;

    let startPage = Math.floor((this.currentPage - 1) / visiblePages) * visiblePages + 1;

    let endPage = Math.min(this.totalPages, startPage + visiblePages - 1);

    this.totalPagesArray = [];

    for (let i = startPage; i <= endPage; i++) {

      this.totalPagesArray.push(i);
    }

  }

  onFiltersMoviesChanged(filters: any) {

    this.filters = filters;
    this.loadMovies(this.currentPage, filters);

  }

}
