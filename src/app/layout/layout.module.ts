import { NgModule } from '@angular/core';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { ClassicLayoutModule } from 'app/layout/layouts/classic/classic.module';
import { SharedModule } from 'app/shared/shared.module';
import { IconsModule } from 'app/shared/icons.module';

const layoutModules = [
  // Add layouts
  EmptyLayoutModule,
  ClassicLayoutModule,
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [...layoutModules, SharedModule],
  exports: [LayoutComponent, ...layoutModules],
})
export class LayoutModule {}
