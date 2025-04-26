import { TestBed } from '@angular/core/testing';

import { PSIModService } from './psi-mod.service';

describe('PSIModService', () => {
  let service: PSIModService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PSIModService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
