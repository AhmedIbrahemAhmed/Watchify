import { Component, inject, NgModule, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Authentication } from '../../Core/Services/authentication';
import { Router } from '@angular/router';
import { Toaster } from '../../Core/Services/toaster';
import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, NgClass, FormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {
  response = inject(Authentication);
  router = inject(Router);
  toaster = inject(Toaster);
  isloading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  step: number = 1;
  Email = signal<string | null | undefined>(null);

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  verifyEmail = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  verifyCode = new FormGroup({
    resetCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
  });

  resetpassword = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    newPassword: new FormControl('', [Validators.required, Validators.pattern('^\\w{6,}$')]),
  });

  // Verify Email
  VerifyEmail() {
    if (this.verifyEmail.valid) {
      this.isloading.set(true);
      this.response.VerifyEmail(this.verifyEmail.value).subscribe({
        next: (res) => {
          this.isloading.set(false);
          this.Email.set(this.verifyEmail.get('email')?.value);
          this.step = 2;
          this.toaster.success('Code Sent in your Email Successfully  🎉', 'Success');
          console.log(res);
        },
        error: (err: HttpErrorResponse) => {
          this.isloading.set(false);
          console.log(err);
        },
        complete: () => {
          console.log('Api successfully respond');
        },
      });
      console.log(this.verifyEmail.value);
    }
  }

  // Verify Code
  VerifyCode() {
    var email = this.verifyEmail.get('email')?.value;
    var password = this.resetpassword.get('newPassword')?.value;
    if (this.verifyCode.valid) {
      this.isloading.set(true);
      this.response.ResetCode(this.verifyCode.value).subscribe({
        next: (res) => {
          this.isloading.set(false);
          this.step = 3;
          this.toaster.success('Code verified successfully 🎉', 'Success');
          this.Email.set(email);

          if (email) {
            this.resetpassword.get('email')?.setValue(email);
          }
          if (password) {
            this.resetpassword.get('newPassword')?.setValue(null);
          }

          console.log(this.resetpassword.value);
          console.log(res);
        },
        error: (err: HttpErrorResponse) => {
          this.isloading.set(false);
          console.log(err);
        },
        complete: () => {
          console.log('Api successfully respond');
        },
      });
      console.log(this.verifyCode.value);
    }
  }

  // Reset Password Function

  ResetPassword() {
    if (this.resetpassword.valid) {
      this.isloading.set(true);
      this.response.ResetPassword(this.resetpassword.value).subscribe({
        next: (res) => {
          this.isloading.set(false);
          localStorage.setItem('Token', res.token);
          this.response.SaveUserData();
          this.router.navigate(['/Home']);
          this.toaster.success('Sign In  Successfully  🎉', 'Success');
          console.log(res);
        },
        error: (err: HttpErrorResponse) => {
          this.isloading.set(false);
          console.log(err);
        },
        complete: () => {
          console.log('Api successfully respond');
        },
      });
      console.log(this.resetpassword.value);
    }
  }
}
