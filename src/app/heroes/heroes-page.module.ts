import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeroesPageRoutingModule } from './heroes-page-routing.module';
import { HeroesPageComponent } from './heroes-page.component';
import { SuperHeroService } from '../services/super-hero.service';
import { EditHeroComponent } from './edit-hero/edit-hero.component';
import { AuthInterceptor } from '../interceptors/auth.interceptor';

@NgModule({
  declarations: [HeroesPageComponent, EditHeroComponent],
  imports: [
    CommonModule,
    HeroesPageRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    SuperHeroService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class HeroesPageModule {}
