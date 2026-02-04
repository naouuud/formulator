import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderDeleteButton } from './builder-delete-button';

describe('BuilderDeleteButton', () => {
  let component: BuilderDeleteButton;
  let fixture: ComponentFixture<BuilderDeleteButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderDeleteButton],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderDeleteButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
