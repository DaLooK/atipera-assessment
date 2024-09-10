import { TestBed } from '@angular/core/testing';

import { PeriodicTableService } from './periodic-table.service';

describe('PeriodicTableService', () => {
  let service: PeriodicTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodicTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
