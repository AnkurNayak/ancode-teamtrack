import { NgModule } from '@angular/core';
import { TeamComponent } from './team.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { SearchModule } from '@ancode/components/search/search.module';
import { TableModule } from '@ancode/components/table/table.module';
import { DialogModule } from '@ancode/components/dialog/dialog.module';
import { EmployeeFormModule } from './components/employee-form/emplyee-form.module';

@NgModule({
  declarations: [TeamComponent],
  imports: [
    SharedModule,
    MatIconModule,
    SearchModule,
    TableModule,
    DialogModule,
    EmployeeFormModule,
  ],
  exports: [TeamComponent],
})
export class TeamModule {}
