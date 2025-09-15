import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, MatIconModule, RouterModule.forChild(dashboardRoutes)],
  exports: [DashboardComponent],
})
export class DashboardModule {}
