import { NgModule } from '@angular/core';
import { TeamComponent } from './team.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [TeamComponent],
  imports: [SharedModule],
  exports: [TeamComponent],
})
export class TeamModule {}
