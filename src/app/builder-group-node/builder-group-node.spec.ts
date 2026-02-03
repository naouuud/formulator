import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderGroupNode } from './builder-group-node';

describe('BuilderGroupNode', () => {
  let component: BuilderGroupNode;
  let fixture: ComponentFixture<BuilderGroupNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderGroupNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderGroupNode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
