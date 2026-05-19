import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { JsonBaseUrl } from '../Interfaces/IAuthentication';
import { Toaster } from './toaster';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  watchLater = signal<any[]>([]);
  Favourites = signal<any[]>([]);
  WatchHistory = signal<any[]>([]);

  toaster = inject(Toaster);

  addMedia(mode: string, media: any, type: 'movie' | 'tv') {
    const userId = localStorage.getItem('Id');
    console.log(userId)
    if (!userId) return;

    //  Get user from server
    this.http.get<any>(`${JsonBaseUrl}/Users/${userId}`)
      .subscribe(user => {

        const key = this.getModeKey(mode);
        if (!key) return;

        if (!user[key]) {
          user[key] = [];
        }

        //  check duplicate
        const exists = user[key].some(
          (m: any) => m.id === media.id && m.type === type
        );

        if (exists) {
          this.toaster.success("Already Added");
          return;
        }

        // push media
        user[key].push({
          id: media.id,
          type,
          data: media
        });

        //  update server
        this.http.patch(`${JsonBaseUrl}/Users/${userId}`, {
          [key]: user[key]
        }).subscribe(res => {
          console.log('Added Successfully', res);
          this.toaster.success("Added Successfully");
        });

      });

    if (!userId) return;
  }

  removeMedia(mode: string, mediaId: number, type: 'movie' | 'tv') {

    const userId = localStorage.getItem('Id');

    if (!userId) return;

    this.http.get<any>(`${JsonBaseUrl}/Users/${userId}`)
      .subscribe(user => {

        const key = this.getModeKey(mode);

        if (!key) return;

        user[key] = user[key].filter(
          (m: any) => !(m.id === mediaId && m.type === type)
        );

        this.http.patch(`${JsonBaseUrl}/Users/${userId}`, {
          [key]: user[key]
        }).subscribe({
          next: (res) => {
            console.log('Removed Successfully', res);
            this.watchLater.set(user.WatchLater);
            this.WatchHistory.set(user.WatchHistory);
            this.Favourites.set(user.Favourites);

            this.toaster.success("Removed Successfully");

          },
          error: (err) => {
            console.log(err);
          }
        });

      });
  }


  private getModeKey(mode: string): string {
    switch (mode) {
      case 'watchlist': return 'WatchLater';
      case 'favourite': return 'Favourites';
      case 'history': return 'WatchHistory';
      default: return '';
    }
  }

  getList() {

    const userId = localStorage.getItem('Id');
    if (!userId) return;

    this.http.get<any>(`${JsonBaseUrl}/Users/${userId}`)
      .subscribe(user => {
        this.watchLater.set(user.WatchLater);
        this.Favourites.set(user.Favourites);
        this.WatchHistory.set(user.Favourites);
        console.log(this.watchLater());
      });
  }



}
