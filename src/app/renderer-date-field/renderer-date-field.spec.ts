import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererDateField } from './renderer-date-field';

describe('RendererDateField', () => {
  let component: RendererDateField;
  let fixture: ComponentFixture<RendererDateField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererDateField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendererDateField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
