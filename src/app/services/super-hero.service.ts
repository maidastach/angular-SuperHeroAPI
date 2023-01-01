import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SuperHero } from '../models/super-hero';

@Injectable({
  providedIn: 'root',
})
export class SuperHeroService {
  private url = 'Heroes';
  constructor(private http: HttpClient) {}

  getSuperHeroes(): Observable<SuperHero[]> {
    return this.http.get<SuperHero[]>(`${environment.apiUrl}/${this.url}`);
  }
  getSuperHeroById(hero: SuperHero): Observable<SuperHero> {
    return this.http.get<SuperHero>(
      `${environment.apiUrl}/${this.url}/${hero.id}`
    );
  }
  createSuperHero(hero: SuperHero): Observable<SuperHero[]> {
    return this.http.post<SuperHero[]>(
      `${environment.apiUrl}/${this.url}`,
      hero
    );
  }
  updateSuperHero(hero: SuperHero): Observable<SuperHero[]> {
    return this.http.put<SuperHero[]>(
      `${environment.apiUrl}/${this.url}`,
      hero
    );
  }
  deleteSuperHero(hero: SuperHero): Observable<SuperHero[]> {
    return this.http.delete<SuperHero[]>(
      `${environment.apiUrl}/${this.url}/${hero.id}`
    );
  }
}
