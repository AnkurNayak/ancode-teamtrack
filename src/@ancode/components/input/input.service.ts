import { Injectable } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

export interface InputConfig {
  type: 'text' | 'email' | 'dropdown' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  options?: { value: string | number; label: string }[];
  validators?: ValidatorFn[];
  maxDate?: Date | string[] | null;
  minDate?: Date | string[] | null;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FormInputService {
  constructor() {}

  createControl(value: string | number = '', validators: ValidatorFn[] = []): FormControl {
    return new FormControl(value, validators);
  }

  getErrorMessage(control: AbstractControl | null, label: string): string {
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) {
      return `${label} is required`;
    }

    if (errors['email']) {
      return 'Please enter a valid email address';
    }

    if (errors['minlength']) {
      return `${label} must be at least ${errors['minlength'].requiredLength} characters`;
    }

    if (errors['maxlength']) {
      return `${label} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }

    if (errors['pattern']) {
      return `${label} is not invalid`;
    }
    return 'Invalid value';
  }

  isFieldInvalid(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && control.touched);
  }

  isFieldValid(control: AbstractControl | null): boolean {
    return !!(control && control.valid && control.touched);
  }

  getTextInputConfig(config: Partial<InputConfig>): InputConfig {
    return {
      type: 'text',
      label: 'Text Input',
      placeholder: 'Enter text',
      required: false,
      ...config,
    };
  }

  getEmailInputConfig(config: Partial<InputConfig>): InputConfig {
    return {
      type: 'email',
      label: 'Email',
      placeholder: 'Enter email address',
      required: false,
      icon: 'heroicons_outline:mail',
      validators: [Validators.email],
      ...config,
    };
  }

  getDropdownInputConfig(config: Partial<InputConfig>): InputConfig {
    return {
      type: 'dropdown',
      label: 'Select Option',
      placeholder: 'Select an option',
      required: false,
      options: [],
      ...config,
    };
  }

  getDateInputConfig(config: Partial<InputConfig>): InputConfig {
    return {
      type: 'date',
      label: 'Date',
      placeholder: 'Select date',
      required: false,
      maxDate: new Date().toISOString().split('T'),
      ...config,
    };
  }

  patternValidator(pattern: string | RegExp, errorMessage?: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }

      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

      if (!regex.test(control.value)) {
        return {
          pattern: {
            requiredPattern: pattern.toString(),
            actualValue: control.value,
            message: errorMessage || 'Pattern mismatch',
          },
        };
      }

      return null;
    };
  }
}
