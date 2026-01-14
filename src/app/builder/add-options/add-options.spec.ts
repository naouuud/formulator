import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOptions } from './add-options';

describe('AddOptions', () => {
  let component: AddOptions;
  let fixture: ComponentFixture<AddOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
