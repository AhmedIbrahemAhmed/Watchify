import { ChangeDetectorRef, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { UserService } from '../../Core/Services/user-service';
import { MediaCard } from "../media-card/media-card";

@Component({
  selector: 'app-watch-later',
  imports: [MediaCard],
  templateUrl: './watch-later.html',
  styleUrl: './watch-later.css',
})
export class WatchLater {

  userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getList();
  }
  @ViewChild('scrolWatchList')
  scrolWatchList!: ElementRef;

  scrollLeft() {
    this.scrolWatchList.nativeElement.scrollBy({
      left: -350,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrolWatchList.nativeElement.scrollBy({
      left: 350,
      behavior: 'smooth'
    });
  }






}
