import { Routes } from '@angular/router';
import { Auth } from './Layouts/auth/auth';
import { SignUp } from './Components/sign-up/sign-up';
import { SignIn } from './Components/sign-in/sign-in';
import { Blank } from './Layouts/blank/blank';
import { Home } from './Components/home/home';
import { NotFound } from './Components/not-found/not-found';
import { MovieDetail } from './Components/movie-detail/movie-detail';

export const routes: Routes = [
   // Blank route
  {
    path: 'watchify',
    component: Blank,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: Home,
      },
      { path: 'movies/:id', component: MovieDetail, data: { mediaType: 'movie' } },
      { path: 'tv-show/:id', component: MovieDetail, data: { mediaType: 'tv' } },
    ],
  },
  // Auth routes
  {
    path: '',
    component: Auth,
    children: [
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full',
      },
      {
        path: 'sign-up',
        component: SignUp,
      },
      {
        path: 'sign-in',
        component: SignIn,
      },
    ],
  },

 

  // Wildcard route for 404 page
  {
    path: '**',
    component: NotFound,
  },
];
