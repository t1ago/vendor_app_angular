import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { INavbarItem } from './shared/components/navbar/interfaces/navbar-item';
import { Toast } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('vendor_app_angular');

  navbarItems: INavbarItem[] = [
    {
      name: 'Produtos',
      route: '#',
      children: [
        {
          name: 'Categoria',
          route: '/category/form',
          children: [],
        },
      ],
    },
  ];
}
