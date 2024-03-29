import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  // Redirect to /home if no route found
  {
    path: '**',
    redirectTo: '/home',
  },
];
