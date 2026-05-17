import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MediaCard } from "../media-card/media-card";
import { TmdbService } from '../../Core/Services/tmdb-service';

@Component({
  selector: 'app-trending',
  imports: [MediaCard],
  templateUrl: './trending.html',
  styleUrl: './trending.css',
})
export class Trending {


  private tmdbService = inject(TmdbService);
  private cdr = inject(ChangeDetectorRef);

  all: any[] = [];

  ngOnInit() {
    this.tmdbService.getAllTrending()
      .subscribe((res: any) => {
        this.all = res;
        this.cdr.detectChanges();
        console.log(this.all);
      });
  }



  @ViewChild('scrollContainer')
  scrollContainer!: ElementRef;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -350,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 350,
      behavior: 'smooth'
    });
  }

}
