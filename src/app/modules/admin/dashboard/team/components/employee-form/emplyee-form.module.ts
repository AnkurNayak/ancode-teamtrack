import { NgModule } from '@angular/core';
import { EmployeeFormComponent } from './employee-form.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [EmployeeFormComponent],
  imports: [SharedModule, MatIconModule],
  exports: [EmployeeFormComponent],
})
export class EmployeeFormModule {}
