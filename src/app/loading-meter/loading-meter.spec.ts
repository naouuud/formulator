import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingMeter } from './loading-meter';

describe('LoadingMeter', () => {
  let component: LoadingMeter;
  let fixture: ComponentFixture<LoadingMeter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingMeter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingMeter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
