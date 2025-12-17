import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererAddressGroup } from './renderer-address-group';

describe('RendererAddress', () => {
  let component: RendererAddressGroup;
  let fixture: ComponentFixture<RendererAddressGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererAddressGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(RendererAddressGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
