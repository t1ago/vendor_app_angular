import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Navbar } from './navbar';
import { EnvironmentInjector, inputBinding, signal } from '@angular/core';
import { INavbarItem } from './interfaces/navbar-item';
import { provideRouter } from '@angular/router';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  const items = signal<INavbarItem[]>([]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Navbar, {
      bindings: [inputBinding('items', items)],
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    // THEN
    expect(component).toBeTruthy();
  });

  it('should verify menu itens', () => {
    // GIVEN
    items.set([
      {
        name: 'test',
        children: [
          {
            name: 'test',
            children: [],
            route: '',
          },
        ],
        route: '',
      },
    ]);
    fixture.detectChanges();

    expect(component.items().length).toEqual(1);
  });
});
