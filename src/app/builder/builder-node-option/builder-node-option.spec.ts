import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNodeOption } from './builder-node-option';

describe('BuilderNodeOption', () => {
  let component: BuilderNodeOption;
  let fixture: ComponentFixture<BuilderNodeOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNodeOption],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderNodeOption);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
