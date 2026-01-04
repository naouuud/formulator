import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderFormTitle } from './builder-form-title';

describe('BuilderFormTitle', () => {
  let component: BuilderFormTitle;
  let fixture: ComponentFixture<BuilderFormTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderFormTitle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderFormTitle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
