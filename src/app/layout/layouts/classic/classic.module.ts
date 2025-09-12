import { NgModule } from '@angular/core';
import { ClassicLayoutComponent } from './classic.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { NavigationModule } from '@ancode/components/navigation/navigation.module';
import { HeaderModule } from '@ancode/components/header/header.module';

@NgModule({
  declarations: [ClassicLayoutComponent],
  imports: [RouterModule, SharedModule, NavigationModule, HeaderModule],
  exports: [ClassicLayoutComponent],
})
export class ClassicLayoutModule {}
