import { TestBed } from '@angular/core/testing';

import { XLModService } from './xl-mod.service';

describe('XLModService', () => {
  let service: XLModService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XLModService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
