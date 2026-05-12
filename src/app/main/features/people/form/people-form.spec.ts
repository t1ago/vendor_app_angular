import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleForm } from './people-form';

describe('PeopleForm', () => {
  let component: PeopleForm;
  let fixture: ComponentFixture<PeopleForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
