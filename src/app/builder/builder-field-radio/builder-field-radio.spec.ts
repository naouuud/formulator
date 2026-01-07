import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderFieldRadio } from './builder-field-radio';

describe('BuilderFieldRadio', () => {
  let component: BuilderFieldRadio;
  let fixture: ComponentFixture<BuilderFieldRadio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderFieldRadio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderFieldRadio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
