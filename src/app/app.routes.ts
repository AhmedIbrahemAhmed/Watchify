import { Routes, CanActivateFn } from '@angular/router';
import { Auth } from './Layouts/auth/auth';
import { SignUp } from './Components/sign-up/sign-up';
import { SignIn } from './Components/sign-in/sign-in';
import { Blank } from './Layouts/blank/blank';
import { Home } from './Components/home/home';
import { NotFound } from './Components/not-found/not-found';
import { authneticatedGuard } from './Core/guards/authneticated-guard';
import { ForgetPassword } from './Components/forget-password/forget-password';
import { MoviesGallery } from './Components/movies-gallery/movies-gallery';
import { TvGallery } from './Components/tv-gallery/tv-gallery';
import { MovieDetail } from './Components/movie-detail/movie-detail';

export const routes: Routes = [
  
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
      {
        path: 'forgetpassword',
        component: ForgetPassword,
      },
    ],
  },

// Blank route
  {
    path: '',
    component: Blank,
    canActivate: [authneticatedGuard],
    children: [
      {
        path: '',
        redirectTo: 'Home',
        pathMatch: 'full',
      },
      {
        path: 'Home',
        component: Home,
      },
      { path: 'Movies/:id', component: MovieDetail, data: { mediaType: 'movie' } },
      { path: 'TvShows/:id', component: MovieDetail, data: { mediaType: 'tv' } },
      {
        path: 'Movies',
        component: MoviesGallery,
      },
      {
        path: 'TvShows',
        component: TvGallery,
      },
      
    ],
  },

  // Wildcard route for 404 page
  {
    path: '**',
    component: NotFound,
  },
];
