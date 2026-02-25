import { TestBed } from '@angular/core/testing';

import { FormRepoLocal } from './form-repo-local';

describe('FormRepoLocal', () => {
  let service: FormRepoLocal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormRepoLocal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
