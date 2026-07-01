import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'cadastrar-video',
    loadComponent: () => import('./features/videos/video-form/video-form').then((m) => m.VideoForm),
    canActivate: [authGuard],
  },
  {
    path: 'videos',
    loadComponent: () => import('./features/videos/video-list/video-list').then((m) => m.VideoList),
    canActivate: [authGuard],
  },
  {
    path: 'videos/:id',
    loadComponent: () =>
      import('./features/videos/video-detail/video-detail').then((m) => m.VideoDetail),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
