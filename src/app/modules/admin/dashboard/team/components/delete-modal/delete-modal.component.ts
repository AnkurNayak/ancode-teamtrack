import { DialogService } from '@ancode/components/dialog/dialog.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../../team.service';

@Component({
  selector: 'employee-delete-dialog',
  templateUrl: './delete-modal.component.html',
  imports: [MatIconModule],
})
export class DeleteModalComponent implements OnInit, OnDestroy {
  employeeData: any;

  private _unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(private _dialogService: DialogService, private _employeeService: EmployeeService) {}

  /*
  Hooks
  */
  ngOnInit(): void {
    this._dialogService.config$.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
      if (config.data) {
        this.employeeData = config.data;
      }
    });
  }

  confirmDelete(): void {
    this._employeeService.deleteEmployeeById(this.employeeData.id).subscribe({
      next: (success) => {
        if (success) {
          this.closeDialog();
        }
      },
      error: (err) => {
        console.error('Error deleting employee', err);
      },
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  closeDialog(): void {
    this._dialogService.closeDialog();
  }
}
