import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNodeEmail } from './builder-node-email';

describe('BuilderNodeEmail', () => {
  let component: BuilderNodeEmail;
  let fixture: ComponentFixture<BuilderNodeEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderNodeEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderNodeEmail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
