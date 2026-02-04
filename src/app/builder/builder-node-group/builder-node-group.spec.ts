import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNodeGroup } from './builder-node-group';

describe('BuilderNodeGroup', () => {
  let component: BuilderNodeGroup;
  let fixture: ComponentFixture<BuilderNodeGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNodeGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderNodeGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
