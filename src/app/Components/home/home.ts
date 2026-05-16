import { Authentication } from './../../Core/Services/authentication';
import { Component, inject } from '@angular/core';
import { authneticatedGuard } from '../../Core/guards/authneticated-guard';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
