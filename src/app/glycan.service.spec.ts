import { TestBed } from '@angular/core/testing';

import { GlycanService } from './glycan.service';

describe('GlycanService', () => {
  let service: GlycanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlycanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
