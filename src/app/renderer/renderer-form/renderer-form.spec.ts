import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererForm } from './renderer-form';

describe('RendererForm', () => {
  let component: RendererForm;
  let fixture: ComponentFixture<RendererForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendererForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
