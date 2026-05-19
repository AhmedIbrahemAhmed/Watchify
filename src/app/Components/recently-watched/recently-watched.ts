import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UserService } from '../../Core/Services/user-service';
import { MediaCard } from "../media-card/media-card";

@Component({
  selector: 'app-recently-watched',
  imports: [MediaCard],
  templateUrl: './recently-watched.html',
  styleUrl: './recently-watched.css',
})
export class RecentlyWatched {

  userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getList();
  }
  @ViewChild('scrolRecentlyWatched')
  scrolRecentlyWatched!: ElementRef;

  scrollLeft() {
    this.scrolRecentlyWatched.nativeElement.scrollBy({
      left: -350,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrolRecentlyWatched.nativeElement.scrollBy({
      left: 350,
      behavior: 'smooth'
    });
  }


}
