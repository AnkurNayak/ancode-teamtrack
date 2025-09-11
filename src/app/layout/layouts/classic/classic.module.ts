import { NgModule } from '@angular/core';
import { ClassicLayoutComponent } from './classic.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [ClassicLayoutComponent],
  imports: [RouterModule, SharedModule],
  exports: [ClassicLayoutComponent],
})
export class ClassicLayoutModule {}
