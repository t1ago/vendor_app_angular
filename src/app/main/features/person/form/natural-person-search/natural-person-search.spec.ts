import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturalPersonSearch } from './natural-person-search';

describe('NaturalPersonSearch', () => {
  let component: NaturalPersonSearch;
  let fixture: ComponentFixture<NaturalPersonSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaturalPersonSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturalPersonSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
