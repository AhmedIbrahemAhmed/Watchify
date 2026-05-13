import { Routes } from '@angular/router';
import { Auth } from './Layouts/auth/auth';
import { SignUp } from './Components/sign-up/sign-up';
import { SignIn } from './Components/sign-in/sign-in';
import { Blank } from './Layouts/blank/blank';
import { Home } from './Components/home/home';
import { NotFound } from './Components/not-found/not-found';

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
    ],
  },

  // Blank route
  {
    path: '',
    component: Blank,
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
    ],
  },

  // Wildcard route for 404 page
  {
    path: '**',
    component: NotFound,
  },
];
