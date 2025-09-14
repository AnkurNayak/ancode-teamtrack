import { DialogService } from '@ancode/components/dialog/dialog.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeService } from './team.service';
import { Employee } from './team.types';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'employees',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: false,
})
export class TeamComponent implements OnInit, AfterViewInit, OnDestroy {
  public isDialogOpen: boolean = false;
  public isFilterOpen: boolean = false;
  public departMents = [
    { value: 'hr', label: 'HR' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
  ];

  tableCols = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department', type: 'badge' },
    { key: 'dateOfJoining', label: 'Date of Joining' },
    { key: 'createdAt', label: 'Created' },
    { key: 'updatedAt', label: 'Updated' },
  ];
  tableRows: Employee[] = [];

  selectedDepartments: string[] = [];
  searchInput: string = '';

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(private _dialogService: DialogService, private _employeeService: EmployeeService) {}

  /**
   * Hooks
   */
  ngOnInit(): void {
    // this._employeeService.getEmployees({ search: '', sortBy: 'dateOfJoining', sortOrder: 'asc' });
    this._loadEmployees();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /* Employee list*/
  private _loadEmployees(): void {
    this._employeeService
      .getEmployees({
        search: this.searchInput,
        department: this.selectedDepartments.length > 0 ? this.selectedDepartments[0] : undefined,
        sortBy: 'dateOfJoining',
        sortOrder: 'asc',
      })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.tableRows = response.data.map((emp) => ({
          ...emp,
          createdAt: format(parseISO(emp.createdAt.toString()), 'PPP p'),
          updatedAt: format(parseISO(emp.updatedAt.toString()), 'PPP p'),
          dateOfJoining: format(parseISO(emp.dateOfJoining), 'PPP'),
        }));
      });
  }

  /**
   * Search
   */
  onSearchChange(searchValue: string): void {
    this.searchInput = searchValue;
    console.log('Search value:', searchValue);
  }

  /* Filter */
  onDepartmentSelect(event: any): void {
    this.selectedDepartments = [event.target.value];
  }

  openFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  openDialog() {
    this._dialogService.openDialog(EmployeeFormComponent);
  }

  closeDialog() {
    this._dialogService.closeDialog();
  }

  /* Table actions */
  openEditMode(row: any) {
    alert(`Open edit dialog for: ${row.name}`);
  }

  openDeleteDialog(row: any) {
    const confirmed = confirm(`Are you sure you want to delete: ${row.name}?`);
    if (confirmed) {
      console.log('Deleting', row);
    }
  }
}
