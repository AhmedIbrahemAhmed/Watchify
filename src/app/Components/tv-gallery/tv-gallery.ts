import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FilterBar } from "../filter-bar/filter-bar";
import { MediaCard } from "../media-card/media-card";
import { Pagination } from "../pagination/pagination";
import { TmdbService } from '../../Core/Services/tmdb-service';

@Component({
  selector: 'app-tv-gallery',
  imports: [FilterBar, MediaCard, Pagination],
  templateUrl: './tv-gallery.html',
  styleUrl: './tv-gallery.css',
})
export class TvGallery {
  tmdbService = inject(TmdbService);
  cdr = inject(ChangeDetectorRef);

  tvShows: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  filters: any = {};
  mediaType = 'tv';


  ngOnInit(): void {
    this.loadTVShows(this.currentPage);
  }

  loadTVShows(page: number, filters?: any) {

    this.tmdbService.getAllTvShows(page, filters).subscribe(

      (res: any) => {

        this.tvShows = res.results;

        this.currentPage = res.page;

        this.totalPages = res.total_pages;

        this.generatePagination();

        this.cdr.detectChanges();
        console.log(this.tvShows);

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

  onFiltersTvChanged(filters: any) {

    this.filters = filters;
    this.loadTVShows(this.currentPage, filters);

  }

}



