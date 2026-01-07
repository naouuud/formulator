import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderFieldDate } from './builder-field-date';

describe('BuilderFieldDate', () => {
  let component: BuilderFieldDate;
  let fixture: ComponentFixture<BuilderFieldDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderFieldDate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderFieldDate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
