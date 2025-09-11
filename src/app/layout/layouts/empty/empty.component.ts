import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'empty-layout',
  templateUrl: './empty.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class EmptyLayoutComponent implements OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  /**
   * Constructor
   */
  constructor() {}

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
