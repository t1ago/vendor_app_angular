import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { INavbarItem } from './interfaces/navbar-item';
import { Navbar } from './navbar';

describe('Navbar', () => {
    let component: Navbar;
    let fixture: ComponentFixture<Navbar>;

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [Navbar],
            providers: [provideRouter([])],
        });

        fixture = TestBed.createComponent(Navbar);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should render navbar items names', () => {
        // GIVEN
        const items: INavbarItem[] = [
            { name: 'Home', route: '/home', children: [] },
            { name: 'Products', route: '/products', children: [] },
        ];

        fixture.componentRef.setInput('items', items);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const links = compiled.querySelectorAll('.nav-link');

        // THEN
        expect(links.length).toBe(2);
        expect(links[0].textContent).toContain('Home');
        expect(links[1].textContent).toContain('Products');
    });

    it('should render dropdown when item has children', () => {
        // GIVEN
        const items: INavbarItem[] = [
            {
                name: 'Parent',
                route: '/parent',
                children: [{ name: 'Child', route: '/child', children: [] }],
            },
        ];

        fixture.componentRef.setInput('items', items);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const parentLink = compiled.querySelector('.nav-link');
        const dropdownItems = compiled.querySelectorAll('.dropdown-item');

        // THEN
        expect(parentLink?.className).toContain('dropdown-toggle');
        expect(dropdownItems.length).toBe(1);
        expect(dropdownItems[0].textContent).toContain('Child');
    });

    it('should not render dropdown when item has no children', () => {
        // GIVEN
        const items: INavbarItem[] = [{ name: 'Simple', route: '/simple', children: [] }];

        fixture.componentRef.setInput('items', items);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const parentLink = compiled.querySelector('.nav-link');
        const dropdownMenu = compiled.querySelector('.dropdown-menu');

        // THEN
        expect(parentLink?.className).not.toContain('dropdown-toggle');
        expect(dropdownMenu).toBeNull();
    });

    it('should render empty when no items', () => {
        // GIVEN
        fixture.componentRef.setInput('items', []);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const links = compiled.querySelectorAll('.nav-link');

        // THEN
        expect(links.length).toBe(0);
    });
});
