import { Routes } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'classic',
    },
    children: [
      // Default redirect
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('app/modules/admin/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
