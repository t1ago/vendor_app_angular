import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalPartner } from './external-partner';

describe('ExternalPartner', () => {
  let component: ExternalPartner;
  let fixture: ComponentFixture<ExternalPartner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalPartner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalPartner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
