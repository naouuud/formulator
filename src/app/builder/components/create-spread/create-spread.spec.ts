import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpread } from './create-spread';

describe('CreateSpread', () => {
  let component: CreateSpread;
  let fixture: ComponentFixture<CreateSpread>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSpread],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSpread);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
