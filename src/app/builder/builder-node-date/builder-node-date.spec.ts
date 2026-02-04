import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNodeDate } from './builder-node-date';

describe('BuilderNodeDate', () => {
  let component: BuilderNodeDate;
  let fixture: ComponentFixture<BuilderNodeDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNodeDate],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderNodeDate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
