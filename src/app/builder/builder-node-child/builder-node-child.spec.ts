import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNodeChild } from './builder-node-child';

describe('BuilderNodeChild', () => {
  let component: BuilderNodeChild;
  let fixture: ComponentFixture<BuilderNodeChild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNodeChild]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderNodeChild);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
