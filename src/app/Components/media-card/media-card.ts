import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.html',
  styleUrl: './media-card.css',

})
export class MediaCard {

  @Input() media: any;
  @Input() mediaType!: 'movie' | 'tv';

  ngOnInit() {
    console.log(this.media, this.mediaType);

  }
  goToDetails() {
    // Navigate to the details page based on media type and ID
    const id = this.media.id;
    const route = this.mediaType === 'movie' ? `/Movies/${id}` : `/TvShows/${id}`;
    window.location.href = route; // Simple navigation, consider using Angular Router for better performance
  }




}
