import { Component, HostBinding, OnDestroy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class DialogComponent {
  constructor() {}
}
