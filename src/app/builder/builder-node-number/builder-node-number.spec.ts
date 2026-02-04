import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNodeNumber } from './builder-node-number';

describe('BuilderNodeNumber', () => {
  let component: BuilderNodeNumber;
  let fixture: ComponentFixture<BuilderNodeNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNodeNumber],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderNodeNumber);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
