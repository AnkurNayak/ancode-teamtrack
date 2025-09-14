import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  startOfToday,
} from 'date-fns';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() selectedDate: Date | null = null;
  @Input() disabled = false;
  @Input() minDate: Date | string[] | null = null;
  @Input() maxDate: Date | string[] | null = null;
  @Input() isOpen = false;
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() calendarClosed = new EventEmitter<void>();

  currentMonth = startOfToday();
  calendarDays: Date[] = [];
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.generateCalendar();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.calendarClosed.emit();
    }
  }

  generateCalendar() {
    const start = startOfWeek(startOfMonth(this.currentMonth));
    const end = endOfWeek(endOfMonth(this.currentMonth));

    this.calendarDays = eachDayOfInterval({ start, end });
  }

  previousMonth() {
    this.currentMonth = subMonths(this.currentMonth, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = addMonths(this.currentMonth, 1);
    this.generateCalendar();
  }

  selectDate(date: Date) {
    if (this.isDateDisabled(date)) return;

    this.selectedDate = date;
    this.dateSelected.emit(date);
  }

  selectToday() {
    const today = startOfToday();
    if (!this.isDateDisabled(today)) {
      this.selectDate(today);
    }
  }

  isDateDisabled(date: Date): boolean {
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    return false;
  }

  trackByDate(index: number, date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  format = format;
  isSameMonth = isSameMonth;
  isToday = isToday;
  isSameDay = isSameDay;
}
