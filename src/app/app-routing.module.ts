import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { HeroGuard } from './guards/hero/hero.guard';
import { NotFoundPageComponent } from './notfound/not-found-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./home/home-page.module').then((m) => m.HomePageModule),
    pathMatch: 'full',
  },
  {
    path: 'hero',
    loadChildren: () =>
      import('./heroes/heroes-page.module').then((m) => m.HeroesPageModule),
    canLoad: [HeroGuard],
    canActivate: [HeroGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-page.module').then((m) => m.AuthPageModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
