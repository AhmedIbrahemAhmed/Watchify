import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { validate, ValidationError } from '@angular/forms/signals';
import { Authentication } from '../../Core/Services/authentication';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  response = inject(Authentication);
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
    this.matchPassword,
  );
  FormSubmit() {
  }
}
