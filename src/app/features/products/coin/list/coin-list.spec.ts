import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinList } from './coin-list';

describe('CoinList', () => {
  let component: CoinList;
  let fixture: ComponentFixture<CoinList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
