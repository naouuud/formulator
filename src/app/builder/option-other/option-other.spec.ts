import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionOther } from './option-other';

describe('OptionOther', () => {
  let component: OptionOther;
  let fixture: ComponentFixture<OptionOther>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionOther]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionOther);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
