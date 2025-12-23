import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderPropLabel } from './builder-prop-label';

describe('BuilderPropLabel', () => {
  let component: BuilderPropLabel;
  let fixture: ComponentFixture<BuilderPropLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderPropLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderPropLabel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
