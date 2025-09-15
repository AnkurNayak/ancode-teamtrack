import { NgModule } from '@angular/core';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { ClassicLayoutModule } from 'app/layout/layouts/classic/classic.module';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { LoadingComponent } from '@ancode/components/loading/loading.component';

const layoutModules = [
  // Add layouts
  EmptyLayoutModule,
  ClassicLayoutModule,
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [...layoutModules, SharedModule, LoadingComponent],
  exports: [LayoutComponent, ...layoutModules],
})
export class LayoutModule {}
