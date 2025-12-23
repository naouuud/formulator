import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderPropMinlength } from './builder-prop-minlength';

describe('BuilderPropMinlength', () => {
  let component: BuilderPropMinlength;
  let fixture: ComponentFixture<BuilderPropMinlength>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderPropMinlength]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderPropMinlength);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
