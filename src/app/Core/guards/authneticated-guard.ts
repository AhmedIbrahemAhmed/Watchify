import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authneticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const useremail = localStorage.getItem('email');

  if (useremail) {
    return true;
  } else {
    router.navigate(['/sign-in']);
    return false;
  }
};
