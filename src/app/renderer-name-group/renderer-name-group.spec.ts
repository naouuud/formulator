import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererNameGroup } from './renderer-name-group';

describe('RendererName', () => {
  let component: RendererNameGroup;
  let fixture: ComponentFixture<RendererNameGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererNameGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(RendererNameGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
