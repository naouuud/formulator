import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderValidation } from './builder-validation';

describe('BuilderValidation', () => {
  let component: BuilderValidation;
  let fixture: ComponentFixture<BuilderValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderValidation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
