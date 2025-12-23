import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderPropRequired } from './builder-prop-required';

describe('BuilderPropRequired', () => {
  let component: BuilderPropRequired;
  let fixture: ComponentFixture<BuilderPropRequired>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderPropRequired]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderPropRequired);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
