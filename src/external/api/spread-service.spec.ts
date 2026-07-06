import { TestBed } from '@angular/core/testing';

import { SpreadService } from './spread.service';

describe('SpreadService', () => {
  let service: SpreadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpreadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
