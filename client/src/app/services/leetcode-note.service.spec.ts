import { TestBed } from '@angular/core/testing';

import { LeetcodeNoteService } from './leetcode-note.service';

describe('LeetcodeNoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeetcodeNoteService = TestBed.get(LeetcodeNoteService);
    expect(service).toBeTruthy();
  });
});
