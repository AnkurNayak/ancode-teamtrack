import { NgModule } from '@angular/core';
import { NavigationComponent } from './navigation.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [NavigationComponent],
  imports: [CommonModule, RouterModule, MatIconModule],
  exports: [NavigationComponent],
})
export class NavigationModule {}
