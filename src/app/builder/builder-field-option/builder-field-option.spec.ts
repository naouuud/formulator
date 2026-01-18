import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderFieldOption } from './builder-field-option';

describe('BuilderFieldRadio', () => {
  let component: BuilderFieldOption;
  let fixture: ComponentFixture<BuilderFieldOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderFieldOption],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderFieldOption);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
