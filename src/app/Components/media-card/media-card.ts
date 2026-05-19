import { Component, inject, Input } from '@angular/core';
import { CardMode } from '../../Core/Interfaces/movie-model';
import { UserService } from '../../Core/Services/user-service';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.html',
  styleUrl: './media-card.css',

})
export class MediaCard {

  @Input() media: any;
  @Input() mediaType!: 'movie' | 'tv';
  @Input() mode: CardMode = 'browse';
  userService = inject(UserService);


  ngOnInit() {
    console.log(this.media, this.mediaType);

  }
  goToDetails() {
    // Navigate to the details page based on media type and ID
    const id = this.media.id;
    const route = this.mediaType === 'movie' ? `/Movies/${id}` : `/TvShows/${id}`;
    window.location.href = route; // Simple navigation, consider using Angular Router for better performance
  }

  addToWatchLater() {
    this.userService.addMedia('watchlist', this.media, this.mediaType);
  }

  removeFromWatchLater() {
    this.userService.removeMedia(
      'watchlist',
      this.media.id,
      this.mediaType
    );


  }

  addToFavourites() {
    this.userService.addMedia('favourite', this.media, this.mediaType);

  }
  removeFromFavourites() {
    this.userService.removeMedia(
      'favourite',
      this.media.id,
      this.mediaType
    );
    console.log("amna")
  }

}
