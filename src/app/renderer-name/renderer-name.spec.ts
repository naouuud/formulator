import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererName } from './renderer-name';

describe('RendererName', () => {
  let component: RendererName;
  let fixture: ComponentFixture<RendererName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererName]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendererName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
