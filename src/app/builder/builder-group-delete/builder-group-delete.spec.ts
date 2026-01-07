import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderGroupDelete } from './builder-group-delete';

describe('BuilderGroupDelete', () => {
  let component: BuilderGroupDelete;
  let fixture: ComponentFixture<BuilderGroupDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderGroupDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderGroupDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
