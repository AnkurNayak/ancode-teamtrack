import { Component, Input, forwardRef, OnDestroy, HostListener } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { FormInputService, InputConfig } from './input.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-form-input',
  templateUrl: './input.component.html',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnDestroy {
  @Input() config: InputConfig = { type: 'text', label: '' };
  @Input() control: FormControl | null = null;
  @Input() showErrors: boolean = true;

  value: string | number = '';
  isDropDownOpen: boolean = false;
  disabled: boolean = false;
  selectedDate: Date | null = null;
  isCalendarOpen = false;

  private _destroy$ = new Subject<void>();
  private _onChange = (value: string | number) => {};
  private _onTouched = () => {};
  valueChange: any;

  constructor(private _formInputService: FormInputService) {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * ControlValueAccessor
   * @param value
   */
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Calender
   */
  get selectedDateLabel(): string {
    return this.selectedDate ? format(this.selectedDate, 'MMM dd, yyyy') : '';
  }
  toggleCalendar(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isCalendarOpen = !this.isCalendarOpen;
      if (!this.isCalendarOpen) {
        this._onTouched();
        this.control?.markAsTouched();
      }
    }
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.value = format(date, 'yyyy-MM-dd');
    this._onChange(this.value);
    this.closeCalendar();
  }

  closeCalendar() {
    this.isCalendarOpen = false;
  }

  /**
   * Input handlers
   * @param event
   */
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this._onChange(this.value);
  }

  onBlur(): void {
    this._onTouched();
  }

  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    // console.log(this.value);
    this._onChange(this.value);
  }

  /**
   * Dropdown
   * @param event
   */
  toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDropDownOpen = !this.isDropDownOpen;
    if (!this.isDropDownOpen) this.control?.markAsTouched();
  }

  selectOption(option: { value: any; label: string }): void {
    this.value = option.value;
    this._onChange(this.value);
    this._onTouched();
    this.isDropDownOpen = false;
  }

  closeDropdown(): void {
    this.isDropDownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as Element;
    const isClickInsideDropdown = target.closest('.dropdown-select-option');
    if (!isClickInsideDropdown) {
      this.isDropDownOpen = false;
    }
  }

  // Utility methods
  get selectedOptionLabel(): string {
    if (!this.config.options || !this.value) return '';
    const option = this.config.options.find((opt) => opt.value === this.value);
    return option ? option.label : '';
  }

  get hasError(): boolean {
    return this.showErrors && this._formInputService.isFieldInvalid(this.control);
  }

  get hasSuccess(): boolean {
    return this._formInputService.isFieldValid(this.control);
  }

  get errorMessage(): string {
    if (!this.hasError) return '';
    return this._formInputService.getErrorMessage(this.control, this.config.label);
  }

  get isRequired(): boolean {
    return !!this.config.required;
  }

  get inputId(): string {
    return this.config.label.toLowerCase().replace(/\s+/g, '-');
  }

  get currentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
