import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '@ancode/components/dialog/dialog.service';
import { FormInputService, InputConfig } from '@ancode/components/input/input.service';
import { endOfDay, format, parse } from 'date-fns';
import { EmployeeService } from '../../team.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  employeeForm: FormGroup;
  nameConfig!: InputConfig;
  emailConfig!: InputConfig;
  departmentConfig!: InputConfig;
  dateOfJoiningConfig!: InputConfig;

  isEditMode: boolean = false;
  employeeId: string | null = null;

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private _dialogService: DialogService,
    private fb: FormBuilder,
    private _formInputService: FormInputService,
    private _employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      name: this._formInputService.createControl('', [
        Validators.required,
        Validators.minLength(3),
        this._formInputService.patternValidator(
          /^[a-zA-Z\s]+$/,
          'Name should contain only letters and spaces'
        ),
      ]),
      email: this._formInputService.createControl('', [Validators.required, Validators.email]),
      department: this._formInputService.createControl('', [Validators.required]),
      dateOfJoining: this._formInputService.createControl('', [Validators.required]),
    });

    // this.employeeForm.valueChanges.subscribe((values) => {
    //   console.log('Form values changed:', values);
    // });

    this._setInputConfigs();
  }

  /**
   * Hooks
   */
  ngOnInit(): void {
    this._dialogService.config$.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
      if (config.mode === 'employee-edit' && config.data) {
        this.isEditMode = true;
        this._patchFormValues(config.data);
      } else {
        this.isEditMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /* Ptach values for edit mode */
  private _patchFormValues(employeeData: any): void {
    this.employeeId = employeeData.id;
    const joiningDate = employeeData.dateOfJoining.replace(/(\d+)(st|nd|rd|th)/, '$1');
    const parsedDate = parse(joiningDate, 'MMM d, yyyy', new Date());

    // console.log(parsedDate);
    this.employeeForm.patchValue({
      name: employeeData.name,
      email: employeeData.email,
      department: employeeData.department,
      dateOfJoining: parsedDate,
    });
  }

  private _setInputConfigs(): void {
    this.nameConfig = this._formInputService.getTextInputConfig({
      label: 'Name',
      placeholder: 'Enter full name',
      required: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        this._formInputService.patternValidator(/^[a-zA-Z\s]+$/),
      ],
    });

    this.emailConfig = this._formInputService.getEmailInputConfig({
      label: 'Email',
      placeholder: 'Enter email address',
      required: true,
    });

    this.departmentConfig = this._formInputService.getDropdownInputConfig({
      label: 'Department',
      placeholder: 'Select Department',
      required: true,
      options: [
        { value: 'hr', label: 'HR' },
        { value: 'engineering', label: 'Engineering' },
        { value: 'sales', label: 'Sales' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'finance', label: 'Finance' },
        { value: 'operations', label: 'Operations' },
      ],
    });

    this.dateOfJoiningConfig = this._formInputService.getDateInputConfig({
      label: 'Date of Joining',
      placeholder: 'Select date',
      required: true,
      maxDate: endOfDay(new Date()),
    });
  }

  // Access form controls
  get name() {
    return this.employeeForm.get('name');
  }
  get email() {
    return this.employeeForm.get('email');
  }
  get department() {
    return this.employeeForm.get('department');
  }
  get dateOfJoining() {
    return this.employeeForm.get('dateOfJoining');
  }

  onSubmit() {
    try {
      if (this.employeeForm.valid) {
        const formData = this.employeeForm.value;

        if (this.isEditMode && this.employeeId) {
          // Update existing
          this._employeeService.updateEmployee(this.employeeId, formData).subscribe({
            next: (updatedEmployee) => {
              // console.log('Employee updated:', updatedEmployee);
              this._dialogService.closeDialog();
              this.employeeForm.reset();
            },
            error: (error) => {
              console.error('Error update employee:', error);
            },
          });
        } else {
          // Create new
          this._employeeService.createEmployee(formData).subscribe({
            next: (newEmployee) => {
              console.log('Employee created:', newEmployee);
              this._dialogService.closeDialog();
              this.employeeForm.reset();
            },
            error: (error) => {
              console.error('Error creating employee:', error);
            },
          });
        }
      } else {
        this.employeeForm.markAllAsTouched();
      }
    } catch (err) {
      console.error('Error submitting:', err);
    }
  }

  closeDialog(): void {
    this._dialogService.closeDialog();
  }
}
