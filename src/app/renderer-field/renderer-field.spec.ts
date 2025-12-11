import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererField } from './renderer-field';

describe('RendererField', () => {
  let component: RendererField;
  let fixture: ComponentFixture<RendererField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendererField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
