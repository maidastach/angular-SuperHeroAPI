import { TestBed } from '@angular/core/testing';

import { HeroGuard } from './hero.guard';

describe('HeroGuard', () => {
  let guard: HeroGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HeroGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
