import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderOptions } from './builder-options';

describe('BuilderOptions', () => {
  let component: BuilderOptions;
  let fixture: ComponentFixture<BuilderOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderOptions],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderOptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
