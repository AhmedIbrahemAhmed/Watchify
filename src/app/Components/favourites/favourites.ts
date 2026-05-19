import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UserService } from '../../Core/Services/user-service';
import { MediaCard } from "../media-card/media-card";

@Component({
  selector: 'app-favourites',
  imports: [MediaCard],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css',
})
export class Favourites {
  userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getList();
  }
  @ViewChild('scrolFavourites')
  scrolFavourites!: ElementRef;

  scrollLeft() {
    this.scrolFavourites.nativeElement.scrollBy({
      left: -350,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrolFavourites.nativeElement.scrollBy({
      left: 350,
      behavior: 'smooth'
    });
  }

}
