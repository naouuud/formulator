import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderParent } from './builder-parent';

describe('BuilderParent', () => {
  let component: BuilderParent;
  let fixture: ComponentFixture<BuilderParent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderParent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderParent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
