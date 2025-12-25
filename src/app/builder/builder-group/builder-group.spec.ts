import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderGroup } from './builder-group';

describe('BuilderGroup', () => {
  let component: BuilderGroup;
  let fixture: ComponentFixture<BuilderGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
