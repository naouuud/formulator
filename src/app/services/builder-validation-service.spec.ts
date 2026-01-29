import { TestBed } from '@angular/core/testing';

import { BuilderValidationService } from './builder-validation-service';

describe('BuilderValidationService', () => {
  let service: BuilderValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuilderValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
