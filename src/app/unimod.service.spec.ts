import { TestBed } from '@angular/core/testing';

import { UnimodService } from './unimod.service';

describe('UnimodService', () => {
  let service: UnimodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnimodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
