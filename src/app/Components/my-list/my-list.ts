import { Component } from '@angular/core';
import { WatchLater } from "../watch-later/watch-later";
import { Favourites } from "../favourites/favourites";
import { RecentlyWatched } from "../recently-watched/recently-watched";

@Component({
  selector: 'app-my-list',
  imports: [WatchLater, Favourites, RecentlyWatched],
  templateUrl: './my-list.html',
  styleUrl: './my-list.css',
})
export class MyList { }
