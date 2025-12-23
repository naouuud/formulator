import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderField } from './builder-field';

describe('BuilderField', () => {
  let component: BuilderField;
  let fixture: ComponentFixture<BuilderField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
