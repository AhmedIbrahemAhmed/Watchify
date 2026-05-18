import { Component } from '@angular/core';
import { WatchLater } from "../watch-later/watch-later";
import { Favourites } from "../favourites/favourites";

@Component({
  selector: 'app-my-list',
  imports: [WatchLater, Favourites],
  templateUrl: './my-list.html',
  styleUrl: './my-list.css',
})
export class MyList { }
