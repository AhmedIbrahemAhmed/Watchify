import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video-player.html',
  styleUrl: './video-player.css',
})
export class VideoPlayer {
  @Input() set url(val: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(val);
  }
  safeUrl!: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {}
}
