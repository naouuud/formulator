import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderFieldTextarea } from './builder-field-textarea';

describe('BuilderFieldTextarea', () => {
  let component: BuilderFieldTextarea;
  let fixture: ComponentFixture<BuilderFieldTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderFieldTextarea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderFieldTextarea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
