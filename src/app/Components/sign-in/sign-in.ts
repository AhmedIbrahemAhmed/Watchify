import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Toaster } from '../../Core/Services/toaster';
import { Authentication } from '../../Core/Services/authentication';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  response = inject(Authentication);
  router = inject(Router);
  toaster = inject(Toaster);
  showPassword = signal<boolean>(false);
  msgError = signal<string>('');
  isloading = signal<boolean>(false);

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  FormLogin = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern('^\\w{6,}$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  // Sign In with Google
  loginGoogle() {
    this.response
      .loginWithGoogle()
      .then(async (result) => {
        console.log('Google User:', result.user);

        const token = await result.user.getIdToken();
        localStorage.setItem('Id', result.user.uid);
        localStorage.setItem('email', result.user.email!);
        // Decode Token
        this.response.SaveUserData();

        this.router.navigate(['/Home']);
        this.toaster.success('Sign In  Successfully  🎉', 'Success');

        this.response
          .SignUp({
            email: result.user.email,
            id: result.user.uid,
            IsSubscribe: false,
            SubscriptionEndDate: null,
          })
          .subscribe({
            next: (res) => {
              console.log(res);
            },
            error: (err: HttpErrorResponse) => {
              console.log(err);
            },

            complete: () => {
              console.log('Api successfully respond');
            },
          });
      })
      .catch((error) => {
        console.log('Google Login Error:', error);
      });
  }

  Login() {
    if (this.FormLogin.valid) {
      this.isloading.set(true);

      this.response.SignIn().subscribe({
        next: (res) => {
          const user = res.find(
            (r) =>
              r.email === this.FormLogin.get('email')?.value &&
              r.password === this.FormLogin.get('password')?.value,
          );

          if (user) {
            this.isloading.set(false);
            this.router.navigate(['/Home']);
            localStorage.setItem('Id', user.id!);
            localStorage.setItem('email', user.email!);

            this.toaster.success('You are Log In Successfully 🎉', 'Success');
          } else {
            this.isloading.set(false);

            this.msgError.set('Email or Password is incorrect');
          }

          console.log(res);
        },

        error: (err: HttpErrorResponse) => {
          this.isloading.set(false);

          this.toaster.warning('Login Fail Try Again Later 🎉');

          console.log(err);
        },

        complete: () => {
          console.log('Api successfully respond');
        },
      });

      console.log(this.FormLogin.value);
    }
  }
}
