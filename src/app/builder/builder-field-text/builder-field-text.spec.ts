import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderFieldText } from './builder-field-text';

describe('BuilderFieldText', () => {
  let component: BuilderFieldText;
  let fixture: ComponentFixture<BuilderFieldText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderFieldText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderFieldText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
