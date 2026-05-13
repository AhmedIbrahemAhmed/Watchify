import { Component } from '@angular/core';
import { SignUp } from '../../Components/sign-up/sign-up';
import { SignIn } from '../../Components/sign-in/sign-in';
import { RouterOutlet } from '../../../../node_modules/@angular/router/types/_router_module-chunk';
import { NavAuth } from '../../Components/nav-auth/nav-auth';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet,NavAuth],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {}
