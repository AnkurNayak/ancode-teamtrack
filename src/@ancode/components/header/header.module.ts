import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { MatIconModule } from '@angular/material/icon';
import { IconsModule } from 'app/shared/icons.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [MatIconModule, IconsModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
