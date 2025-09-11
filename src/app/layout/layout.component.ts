import { Component } from '@angular/core';
import { Layout } from 'app/layout/layout.types';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false,
})
export class LayoutComponent {
  layout: Layout;

  constructor() {
    this.layout = 'empty';
  }
}
