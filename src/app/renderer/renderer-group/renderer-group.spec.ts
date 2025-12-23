import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererGroup } from './renderer-group';

describe('RendererGroup', () => {
  let component: RendererGroup;
  let fixture: ComponentFixture<RendererGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendererGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
