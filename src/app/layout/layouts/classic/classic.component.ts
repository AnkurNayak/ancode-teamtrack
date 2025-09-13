import { DialogService } from '@ancode/components/dialog/dialog.service';
import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'classic-layout',
  templateUrl: './classic.component.html',
  standalone: false,
})
export class ClassicLayoutComponent implements OnDestroy {
  isDialogOpen: boolean = false;
  dialogContent$: Observable<any>;

  private subscription = new Subscription();

  constructor(private _dialogService: DialogService) {
    this.dialogContent$ = this._dialogService.content$;

    this.subscription.add(
      this._dialogService.isOpen$.subscribe((isOpen) => {
        this.isDialogOpen = isOpen;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
