import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderPropPlaceholder } from './builder-prop-placeholder';

describe('BuilderPropPlaceholder', () => {
  let component: BuilderPropPlaceholder;
  let fixture: ComponentFixture<BuilderPropPlaceholder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderPropPlaceholder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderPropPlaceholder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
