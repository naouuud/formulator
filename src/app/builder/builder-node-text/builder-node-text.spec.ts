import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNodeText } from './builder-node-text';

describe('BuilderNodeText', () => {
  let component: BuilderNodeText;
  let fixture: ComponentFixture<BuilderNodeText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNodeText],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderNodeText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
