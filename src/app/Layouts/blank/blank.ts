import { Component } from '@angular/core';
import { NavBlank } from '../../Components/nav-blank/nav-blank';
import { Footer } from '../../Components/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-blank',
  imports: [NavBlank, RouterOutlet, Footer],
  templateUrl: './blank.html',
  styleUrl: './blank.css',
})
export class Blank {}
