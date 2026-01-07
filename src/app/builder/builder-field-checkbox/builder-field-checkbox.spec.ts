import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderFieldCheckbox } from './builder-field-checkbox';

describe('BuilderFieldCheckbox', () => {
  let component: BuilderFieldCheckbox;
  let fixture: ComponentFixture<BuilderFieldCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderFieldCheckbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderFieldCheckbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
