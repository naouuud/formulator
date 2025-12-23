import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTypeIcon } from './ui-type-icon';

describe('Type', () => {
  let component: UiTypeIcon;
  let fixture: ComponentFixture<UiTypeIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTypeIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTypeIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
