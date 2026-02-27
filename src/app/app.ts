import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { INavbarItem } from './shared/components/navbar/interfaces/navbar-item';
import { Toast } from './shared/components/toast/toast';
import { PageLoading } from './shared/components/page-loading/page-loading';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet, Toast, PageLoading],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('vendor_app_angular');

  private router = inject(Router);

  navbarItems: INavbarItem[] = [
    {
      name: 'Produtos',
      route: '#',
      children: [
        {
          name: 'Categoria',
          route: '/category/list',
          children: [],
        },
        {
          name: 'Moedas',
          route: '/coin/list',
          children: [],
        }
      ],
    },
  ];


  isNavigating = computed(() => !!this.router.currentNavigation());
}
