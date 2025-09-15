import { DialogService } from '@ancode/components/dialog/dialog.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeService } from './team.service';
import { Employee } from './team.types';
import { format, parseISO } from 'date-fns';
import { SortEvent } from '@ancode/components/table/table.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'employees',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: false,
})
export class TeamComponent implements OnInit, AfterViewInit, OnDestroy {
  public isDialogOpen: boolean = false;
  public isFilterOpen: boolean = false;
  private _searchSubject$ = new Subject<string>();
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  /* Disable download if length 0 */
  donwloadableData = 0;

  public departMents = [
    { value: 'hr', label: 'HR' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
  ];

  tableCols = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department', type: 'badge' },
    { key: 'dateOfJoining', label: 'Date of Joining', sortable: true },
    { key: 'createdAt', label: 'Created On' },
    // { key: 'updatedAt', label: 'Updated' },
  ];
  tableRows: Employee[] = [];

  selectedDepartments: string[] = [];
  searchInput: string = '';

  currentSortKey: 'name' | 'dateOfJoining' | undefined = undefined;
  currentSortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private _dialogService: DialogService,
    private _employeeService: EmployeeService,
    private _elementRef: ElementRef
  ) {}

  /**
   * Hooks
   */
  ngOnInit(): void {
    // this._employeeService.getEmployees({ search: '', sortBy: 'dateOfJoining', sortOrder: 'asc' });
    this.currentSortKey = 'name';
    this.currentSortOrder = 'asc';
    this._loadEmployees();

    // Search fn
    this._searchSubject$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this._unsubscribeAll))
      .subscribe((searchValue) => {
        this.searchInput = searchValue;
        this._loadEmployees();
      });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._searchSubject$.complete();
  }

  /**
   * Observe any data change
   * @param event
   */
  onTableSort(event: SortEvent): void {
    const { column } = event;
    if (this.currentSortKey === column) {
      this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortKey = column as 'name' | 'dateOfJoining';
      this.currentSortOrder = 'asc';
    }
    this._loadEmployees();
  }

  /* Employee list*/
  private _loadEmployees(): void {
    this._employeeService
      .getEmployees({
        search: this.searchInput,
        department: this.selectedDepartments,
        sortBy: this.currentSortKey,
        sortOrder: this.currentSortOrder,
      })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        // disable if len === 0
        this.donwloadableData = response.data.length;
        // console.log('response', response);
        this.tableRows = response.data.map((emp) => ({
          ...emp,
          createdAt: format(parseISO(emp.createdAt.toString()), 'MMM do, yyyy'),
          updatedAt: format(parseISO(emp.updatedAt.toString()), 'MMM do, yyyy'),
          dateOfJoining: format(parseISO(emp.dateOfJoining), 'MMM do, yyyy'),
        }));
      });
  }

  /**
   * Search
   */
  onSearchChange(searchValue: string): void {
    this._searchSubject$.next(searchValue);
  }

  /* Filter */
  onDepartmentSelect(event: any): void {
    const departmentValue = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedDepartments = [...this.selectedDepartments, departmentValue];
    } else {
      this.selectedDepartments = this.selectedDepartments.filter(
        (dept) => dept !== departmentValue
      );
    }

    this._loadEmployees();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isFilterOpen && !this._elementRef.nativeElement.contains(event.target as Node)) {
      this.isFilterOpen = false;
    }
  }
  /* Clear filter */
  clearDepartmentFilters(): void {
    this.selectedDepartments = [];
    this._loadEmployees();
  }

  openFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  openDialog() {
    this._dialogService.openDialog(EmployeeFormComponent, { mode: 'employee-create' });
  }

  closeDialog() {
    this._dialogService.closeDialog();
  }

  /* Table actions */
  openEditMode(row: any) {
    // console.log(row);
    this._dialogService.openDialog(EmployeeFormComponent, { data: row, mode: 'employee-edit' });
  }

  openDeleteDialog(row: any) {
    this._dialogService.openDialog(DeleteModalComponent, { data: row });
  }

  /* Export filtered data */
  downloadEmployeeData(): void {
    this._employeeService
      .getEmployees({
        search: this.searchInput,
        department: this.selectedDepartments,
        sortBy: this.currentSortKey,
        sortOrder: this.currentSortOrder,
      })
      .subscribe((response) => {
        const employees = response.data;
        if (employees.length === 0) return;
        const exportData = employees.map((emp) => ({
          Name: emp.name,
          Email: emp.email,
          Department: emp.department,
          'Date of Joining': format(parseISO(emp.dateOfJoining), 'MMM do, yyyy'),
          'Created At': format(parseISO(emp.createdAt.toString()), 'MMM do, yyyy'),
          'Updated At': format(parseISO(emp.updatedAt.toString()), 'MMM do, yyyy'),
        }));

        this._exportAsExcelFile(exportData, 'Employees');
      });
  }

  /* Download as excell sheet : https://thesiddharthraghuvanshi.medium.com/export-data-as-excel-file-in-angular-angular-excel-export-668473253a46 */
  EXCEL_TYPE = 'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  private _saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: this.EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().toISOString().slice(0, 10) + this.EXCEL_EXTENSION
    );
  }
  private _exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this._saveAsExcelFile(excelBuffer, excelFileName);
  }
}
