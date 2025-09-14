import { NgModule } from '@angular/core';
import { EmployeeFormComponent } from './employee-form.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { InputModule } from '@ancode/components/input/input.module';

@NgModule({
  declarations: [EmployeeFormComponent],
  imports: [SharedModule, MatIconModule, InputModule],
  exports: [EmployeeFormComponent],
})
export class EmployeeFormModule {}
