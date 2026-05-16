import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { NgStyle } from "@angular/common";
import { TmdbService } from '../../Core/Services/tmdb-service';

@Component({
  selector: 'app-hero-banner',
  imports: [NgStyle],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css',
})
export class HeroBanner {

  private tmdbService = inject(TmdbService);
  private cdr = inject(ChangeDetectorRef);
  featured: any = null;
  genres: any;
  ngOnInit() {
    this.tmdbService.loadGenres().subscribe(
      () => {
        this.tmdbService.getAllTrending(2)
          .subscribe((res: any) => {
            this.featured = res[1];
            this.genres = this.tmdbService.getGenresByType(this.featured);
            this.cdr.detectChanges();
          });
      }

    );


  }



}
