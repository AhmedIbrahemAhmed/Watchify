import { Component } from '@angular/core';
import { NavBlank } from '../../Components/nav-blank/nav-blank';
import { RouterOutlet } from '../../../../node_modules/@angular/router/types/_router_module-chunk';
import { Footer } from '../../Components/footer/footer';

@Component({
  selector: 'app-blank',
  imports: [NavBlank, RouterOutlet, Footer],
  templateUrl: './blank.html',
  styleUrl: './blank.css',
})
export class Blank {}
