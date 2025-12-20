import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererDate } from './renderer-date';

describe('RendererDateField', () => {
  let component: RendererDate;
  let fixture: ComponentFixture<RendererDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererDate],
    }).compileComponents();

    fixture = TestBed.createComponent(RendererDate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
