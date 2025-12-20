import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererTextarea } from './renderer-textarea';

describe('RendererTextarea', () => {
  let component: RendererTextarea;
  let fixture: ComponentFixture<RendererTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererTextarea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendererTextarea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
