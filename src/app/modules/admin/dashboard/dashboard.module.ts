import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { TeamComponent } from './team/team.component';
import { dashboardRoutes } from './dashboard.routes';

@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, RouterModule.forChild(dashboardRoutes)],
  exports: [DashboardComponent],
})
export class DashboardModule {}
