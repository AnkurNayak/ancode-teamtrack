import { DialogService } from '@ancode/components/dialog/dialog.service';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';

@Component({
  selector: 'employees',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: false,
})
export class TeamComponent implements AfterViewInit, OnDestroy {
  public isDialogOpen: boolean = false;

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(private _dialogService: DialogService) {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  openDialog() {
    this._dialogService.openDialog(EmployeeFormComponent);
  }

  closeDialog() {
    this._dialogService.closeDialog();
  }
}
