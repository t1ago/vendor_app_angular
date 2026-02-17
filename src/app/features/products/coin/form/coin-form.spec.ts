import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinForm } from './coin-form';

describe('CoinForm', () => {
  let component: CoinForm;
  let fixture: ComponentFixture<CoinForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
