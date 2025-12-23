import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderPropMaxlength } from './builder-prop-maxlength';

describe('BuilderPropMaxlength', () => {
  let component: BuilderPropMaxlength;
  let fixture: ComponentFixture<BuilderPropMaxlength>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderPropMaxlength]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderPropMaxlength);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
