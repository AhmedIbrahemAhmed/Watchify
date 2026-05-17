import { Component } from '@angular/core';
import { SignUp } from '../../Components/sign-up/sign-up';
import { SignIn } from '../../Components/sign-in/sign-in';
import { NavAuth } from '../../Components/nav-auth/nav-auth';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {}
