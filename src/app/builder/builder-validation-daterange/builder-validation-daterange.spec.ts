import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderValidationDaterange } from './builder-validation-daterange';

describe('BuilderValidationDaterange', () => {
  let component: BuilderValidationDaterange;
  let fixture: ComponentFixture<BuilderValidationDaterange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderValidationDaterange]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderValidationDaterange);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
