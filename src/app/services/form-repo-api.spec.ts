import { TestBed } from '@angular/core/testing';

import { FormRepoApi } from './form-repo-api';

describe('FormRepoApi', () => {
  let service: FormRepoApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormRepoApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
