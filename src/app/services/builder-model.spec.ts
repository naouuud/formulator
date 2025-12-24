import { TestBed } from '@angular/core/testing';

import { BuilderModel } from './builder-model';

describe('BuilderModel', () => {
  let service: BuilderModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuilderModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
