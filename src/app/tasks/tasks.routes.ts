import {Routes} from '@angular/router';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tasks').then(m => m.TasksComponent)
  }
];
