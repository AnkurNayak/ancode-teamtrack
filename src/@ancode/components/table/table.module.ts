import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [TableComponent],
  imports: [CommonModule, MatIconModule],
  exports: [TableComponent],
})
export class TableModule {}
