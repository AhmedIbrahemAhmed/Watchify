import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class Toaster {

  private readonly toaster=inject(ToastrService);

  success(message: string, title = 'Success') {
    this.toaster.success(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
    });
  }

  error(message: string, title = 'Error') {
    this.toaster.error(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
    });
  }

  info(message: string, title = 'Info') {
    this.toaster.info(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
    });
  }

  warning(message: string, title = 'Warning') {
    this.toaster.warning(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
    });

}
}
