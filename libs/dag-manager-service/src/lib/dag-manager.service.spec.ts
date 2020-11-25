import { TestBed } from '@angular/core/testing';

import { DagManagerService } from './dag-manager.service';

describe('DagManagerService', () => {
  let service: DagManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DagManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
