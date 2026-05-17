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




}
