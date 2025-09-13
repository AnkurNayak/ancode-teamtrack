import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogService } from '@ancode/components/dialog/dialog.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  standalone: false,
})
export class EmployeeFormComponent {
  employeeForm: FormGroup;

  departments = [
    { value: 'hr', label: 'HR' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
  ];

  constructor(private _dialogService: DialogService, private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z\s]+$/), // Only letters and spaces
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      dateOfJoining: ['', [Validators.required, this.futureDateValidator]],
    });
  }

  // Custom validator to prevent future dates
  futureDateValidator(control: any) {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today to allow today's date

    if (selectedDate > today) {
      return { futureDate: { value: control.value } };
    }

    return null;
  }

  // Getter methods for easy access to form controls in template
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
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      console.log('Form submitted:', formData);
      this.employeeForm.reset();
    } else {
      // Mark all fields as touched to show validation errors
      this.employeeForm.markAllAsTouched();
    }
  }

  // Helper method to get error messages
  getErrorMessage(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }

    if (fieldName === 'name' && field?.hasError('minlength')) {
      return 'Name must be at least 3 characters long';
    }

    if (fieldName === 'name' && field?.hasError('pattern')) {
      return 'Name should contain only letters and spaces';
    }

    if (fieldName === 'email' && field?.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (fieldName === 'dateOfJoining' && field?.hasError('futureDate')) {
      return 'Date of joining cannot be in the future';
    }

    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      department: 'Department',
      dateOfJoining: 'Date of Joining',
    };
    return fieldNames[fieldName] || fieldName;
  }

  // Helper method to check if field should show error
  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get current date in YYYY-MM-DD format for max attribute
  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  closeDialog(): void {
    this._dialogService.closeDialog();
  }
}
