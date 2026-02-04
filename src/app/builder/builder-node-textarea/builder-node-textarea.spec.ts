import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNodeTextarea } from './builder-node-textarea';

describe('BuilderNodeTextarea', () => {
  let component: BuilderNodeTextarea;
  let fixture: ComponentFixture<BuilderNodeTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNodeTextarea],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderNodeTextarea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
