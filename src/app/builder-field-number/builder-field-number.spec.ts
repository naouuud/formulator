import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderFieldNumber } from './builder-field-number';

describe('BuilderFieldNumber', () => {
  let component: BuilderFieldNumber;
  let fixture: ComponentFixture<BuilderFieldNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderFieldNumber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderFieldNumber);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
