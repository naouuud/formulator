import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererAddress } from './renderer-address';

describe('RendererAddress', () => {
  let component: RendererAddress;
  let fixture: ComponentFixture<RendererAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendererAddress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
