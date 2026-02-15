import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIcon } from './form-icon';

describe('FormIcon', () => {
  let component: FormIcon;
  let fixture: ComponentFixture<FormIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
