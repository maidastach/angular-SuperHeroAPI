import { Component } from '@angular/core';
import { SuperHero } from 'src/app/models/super-hero';
import { SuperHeroService } from 'src/app/services/super-hero.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-heroes-page',
  templateUrl: './heroes-page.component.html',
  styleUrls: ['./heroes-page.component.css'],
})
export class HeroesPageComponent {
  heroes: SuperHero[] = [];
  heroToEdit?: SuperHero;
  userRole: 'User' | 'Admin' = 'User';

  constructor(
    private superHeroService: SuperHeroService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.superHeroService
      .getSuperHeroes()
      .subscribe((result: SuperHero[]) => (this.heroes = result));

    this.userService.userSource.subscribe(
      (user) => (this.userRole = user.role)
    );
  }

  setHeroToEdit(hero: SuperHero): void {
    this.heroToEdit = hero;
  }

  createHero(): void {
    this.heroToEdit = new SuperHero();
  }

  updateHeroList(heroes: SuperHero[]): void {
    if (!!heroes) this.heroes = heroes;
    this.heroToEdit = undefined;
  }
}
