import { Routes } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
  },
];
