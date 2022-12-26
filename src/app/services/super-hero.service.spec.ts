import { HttpClient } from '@angular/common/http';
import { SuperHeroService } from './super-hero.service';
import { defer } from 'rxjs';

function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

const expectedHeroes = [
  {
    id: 1,
    name: 'Batman',
    firstName: 'Bruce',
    lastName: 'Wayne',
    place: 'Gotham City',
  },
  {
    id: 2,
    name: 'Spider Man',
    firstName: 'Peter',
    lastName: 'Parker',
    place: 'New York City',
  },
];

const createdHero = {
  id: 3,
  name: 'Superman',
  firstName: 'Clark',
  lastName: 'Kent',
  place: 'Sydney',
};

const updatedHero = {
  id: 1,
  name: 'New Batman',
  firstName: 'Salvatore',
  lastName: 'De Rosa',
  place: 'Gold Coast',
};

describe('SuperHeroService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let heroService: SuperHeroService;

  it('should be created', () => {
    expect(heroService).toBeTruthy();
  });

  // TESTING GET METHOD
  it('should get all heroes', (done: DoneFn) => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    heroService = new SuperHeroService(httpClientSpy);
    httpClientSpy.get.and.returnValue(asyncData(expectedHeroes));

    heroService.getSuperHeroes().subscribe({
      next: (heroes) => {
        expect(heroes).withContext('expected heroes').toEqual(expectedHeroes);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });

  // TESTING POST METHOD
  it('should create hero', (done: DoneFn) => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    heroService = new SuperHeroService(httpClientSpy);
    httpClientSpy.post.and.returnValue(
      asyncData([...expectedHeroes, createdHero])
    );

    heroService.createSuperHero(createdHero).subscribe({
      next: (heroes) => {
        expect(heroes).withContext('expected heroes').toContain(createdHero);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
  });

  // TESTING PUT METHOD
  it('should update hero', (done: DoneFn) => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);
    heroService = new SuperHeroService(httpClientSpy);
    httpClientSpy.put.and.returnValue(
      asyncData([
        ...expectedHeroes.filter((h) => h.id !== updatedHero.id),
        updatedHero,
      ])
    );

    heroService.updateSuperHero(updatedHero).subscribe({
      next: (heroes) => {
        expect(heroes).withContext('expected heroes').toContain(updatedHero);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.put.calls.count()).withContext('one call').toBe(1);
  });

  //TESTING DELETE METHOD
  it('should delete hero', (done: DoneFn) => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['delete']);
    heroService = new SuperHeroService(httpClientSpy);
    httpClientSpy.delete.and.returnValue(
      asyncData(expectedHeroes.filter((h) => h.id !== updatedHero.id))
    );

    heroService.deleteSuperHero(updatedHero).subscribe({
      next: (heroes) => {
        expect(heroes)
          .withContext('expected heroes')
          .not.toContain(updatedHero);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.delete.calls.count()).withContext('one call').toBe(1);
  });
});
