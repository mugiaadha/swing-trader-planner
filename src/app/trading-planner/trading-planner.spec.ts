import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingPlanner } from './trading-planner';

describe('TradingPlanner', () => {
  let component: TradingPlanner;
  let fixture: ComponentFixture<TradingPlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingPlanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingPlanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
