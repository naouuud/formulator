import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionWarning } from './option-warning';

describe('OptionWarning', () => {
  let component: OptionWarning;
  let fixture: ComponentFixture<OptionWarning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionWarning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionWarning);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
