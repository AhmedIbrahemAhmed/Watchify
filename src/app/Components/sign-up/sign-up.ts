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
  showPassword1 = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  msgError = signal<string | null>(null);
  isloading = signal<boolean>(false);

  togglePassword1() {
    this.showPassword1.set(!this.showPassword1());
  }

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

      this.response.SignIn().subscribe({
        next: (users) => {
          const isExist = users.find((u) => u.email === this.Form.get('email')?.value);

          if (isExist) {
            this.msgError.set('Email is already exist');
            this.isloading.set(false);
            return;
          }

          const modelpost = {
            ...this.Form.value,
            IsSubscribe: false,
            SubscriptionEndDate: null,
          };

          this.response.SignUp(modelpost).subscribe({
            next: (res) => {
              this.msgError.set(null);

              this.toaster.success('Sign Up Successfully 🎉', 'Success');

              this.router.navigate(['/sign-in']);

              this.isloading.set(false);
            },

            error: (err: HttpErrorResponse) => {
              this.toaster.warning('Sign Up Fail Try Again Later');

              this.isloading.set(false);

              console.log(err);
            },
          });
        },

        error: (err) => {
          this.isloading.set(false);

          console.log(err);
        },
      });
    }
  }
}
