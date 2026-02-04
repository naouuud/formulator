import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNodeSelect } from './builder-node-select';

describe('BuilderNodeSelect', () => {
  let component: BuilderNodeSelect;
  let fixture: ComponentFixture<BuilderNodeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNodeSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderNodeSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
