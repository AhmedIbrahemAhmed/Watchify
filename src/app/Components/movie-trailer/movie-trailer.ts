import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-trailer',
  imports: [],
  templateUrl: './movie-trailer.html',
  styleUrl: './movie-trailer.css',
})
export class MovieTrailer {
  @Input() set url(value: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
  safeUrl!: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {}
}
