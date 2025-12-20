import { TestBed } from '@angular/core/testing';

import { CentralModelS } from './central-model-s';

describe('CentralModelS', () => {
  let service: CentralModelS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentralModelS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
