import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { INavbarItem } from '@shared/components/navbar/interfaces/navbar-item';
import { Navbar } from '@shared/components/navbar/navbar';
import { PageLoading } from '@shared/components/page-loading/page-loading';
import { PageLoadingService } from '@shared/components/page-loading/services/page-loading-service';

@Component({
    selector: 'app-main',
    imports: [Navbar, RouterOutlet, PageLoading],
    templateUrl: './main.html',
    styleUrl: './main.scss',
})
export class Main {
    protected readonly title = signal('vendor_app_angular');

    private router = inject(Router);

    private pageLoadingService = inject(PageLoadingService);

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
                },
            ],
        },
    ];

    isCurrentNavigation = computed(() => !!this.router.currentNavigation());

    isLoading = this.pageLoadingService.isLoading;
}
