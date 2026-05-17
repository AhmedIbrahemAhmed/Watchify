import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Authentication } from '../../Core/Services/authentication';
import { Router, RouterLink } from '@angular/router';
import { Toaster } from '../../Core/Services/toaster';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  response = inject(Authentication);
  router = inject(Router);
  toaster = inject(Toaster);
  showPassword = signal<boolean>(false);
  msgError = signal<string>('');
  isloading = signal<boolean>(false);

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  matchPassword(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const repassword = group.get('rePassword')?.value;

    if (password != repassword) {
      return { nomatch: true };
    }

    return null;
  }
  Form = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]),
      rePassword: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.pattern('^\\w{6,}$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
    },
    {
      validators: this.matchPassword,
    },
  );

  FormSubmit() {
    if (this.Form.valid) {
      this.isloading.set(true);
      this.response.SignUp(this.Form.value).subscribe({
        next: (res) => {
          this.isloading.set(false);
          this.toaster.success('Sign Up  Successfully  🎉', 'Success');
          this.router.navigate(['/sign-in']);
          console.log(res);
        },
        error: (err: HttpErrorResponse) => {
          this.msgError.set(err?.['error']?.['message']);
          this.toaster.warning('Sign Up  Fail Try Again Later  🎉');
          this.isloading.set(false);
          console.log(err);
        },
        complete: () => {
          console.log('Api successfully respond');
        },
      });
      console.log(this.Form.value);
    }
  }
}
