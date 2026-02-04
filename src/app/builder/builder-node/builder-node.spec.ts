import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNode } from './builder-node';

describe('BuilderNode', () => {
  let component: BuilderNode;
  let fixture: ComponentFixture<BuilderNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderNode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
