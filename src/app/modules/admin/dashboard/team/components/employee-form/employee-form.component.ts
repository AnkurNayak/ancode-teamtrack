import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '@ancode/components/dialog/dialog.service';
import { FormInputService, InputConfig } from '@ancode/components/input/input.service';
import { endOfDay } from 'date-fns';
import { EmployeeService } from '../../team.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeFormComponent {
  employeeForm: FormGroup;

  // Input configurations using your service
  nameConfig!: InputConfig;
  emailConfig!: InputConfig;
  departmentConfig!: InputConfig;
  dateOfJoiningConfig!: InputConfig;

  isSubmitting: boolean = false;

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

    this.setupInputConfigs();
  }

  private setupInputConfigs(): void {
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

  // Access to form controls
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
        console.log('Form submitted:', formData);
        this._employeeService.createEmployee(formData).subscribe();
        this.employeeForm.reset();
      } else {
        this.employeeForm.markAllAsTouched();
      }
    } catch (err) {
      // console.error('Error submitting)
    } finally {
    }
  }

  closeDialog(): void {
    this._dialogService.closeDialog();
  }
}
