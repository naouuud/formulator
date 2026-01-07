import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderFieldSelect } from './builder-field-select';

describe('BuilderFieldSelect', () => {
  let component: BuilderFieldSelect;
  let fixture: ComponentFixture<BuilderFieldSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderFieldSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderFieldSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
