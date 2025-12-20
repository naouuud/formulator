import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderForm } from './builder-form';

describe('BuilderForm', () => {
  let component: BuilderForm;
  let fixture: ComponentFixture<BuilderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
