import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionListsFloat } from './option-lists-float';

describe('OptionListsFloat', () => {
  let component: OptionListsFloat;
  let fixture: ComponentFixture<OptionListsFloat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionListsFloat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionListsFloat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
