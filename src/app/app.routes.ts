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
      {
        path: 'dashboard',
        loadChildren: () =>
          import('app/modules/admin/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    ],
  },
];
