import { Component } from '@angular/core';
import { SuperHero } from './models/super-hero';
import { SuperHeroService } from './services/super-hero.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'DerivcoPrepAng';
  heroes: SuperHero[] = [];
  heroToEdit?: SuperHero;

  constructor(private superHeroService: SuperHeroService) {}

  ngOnInit(): void {
    this.superHeroService
      .getSuperHeroes()
      .subscribe((result: SuperHero[]) => (this.heroes = result));
    console.log(this.heroes);
  }

  setHeroToEdit(hero: SuperHero): void {
    this.heroToEdit = hero;
  }

  createHero(): void {
    this.heroToEdit = new SuperHero() 
  }

  updateHeroList(heroes: SuperHero[]): void {
    this.heroes = heroes
    this.heroToEdit = undefined
  }
}
