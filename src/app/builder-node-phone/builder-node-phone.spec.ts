import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNodePhone } from './builder-node-phone';

describe('BuilderNodePhone', () => {
  let component: BuilderNodePhone;
  let fixture: ComponentFixture<BuilderNodePhone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNodePhone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderNodePhone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
