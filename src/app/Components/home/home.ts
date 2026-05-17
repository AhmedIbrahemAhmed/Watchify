import { Authentication } from './../../Core/Services/authentication';
import { Component, inject } from '@angular/core';
import { authneticatedGuard } from '../../Core/guards/authneticated-guard';
import { HeroBanner } from "../hero-banner/hero-banner";
import { Trending } from "../trending/trending";

@Component({
  selector: 'app-home',
  imports: [HeroBanner, Trending],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home { }
