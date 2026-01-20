import { Component, input } from '@angular/core';
import { INavbarItem } from './interfaces/navbar-item';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  items = input<INavbarItem[]>([]);
}
