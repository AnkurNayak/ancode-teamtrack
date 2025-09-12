import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TeamComponent } from './team/team.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  { path: 'team', component: TeamComponent },
];
