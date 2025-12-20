import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererParent } from './renderer-parent';

describe('RendererParent', () => {
  let component: RendererParent;
  let fixture: ComponentFixture<RendererParent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererParent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendererParent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
