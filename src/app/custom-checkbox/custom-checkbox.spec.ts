import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCheckbox } from './custom-checkbox';

describe('CustomCheckbox', () => {
  let component: CustomCheckbox;
  let fixture: ComponentFixture<CustomCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCheckbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomCheckbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
