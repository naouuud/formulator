import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRadio } from './custom-radio';

describe('CustomCheckbox', () => {
  let component: CustomRadio;
  let fixture: ComponentFixture<CustomRadio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomRadio],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomRadio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
