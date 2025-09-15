import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { getHours } from 'date-fns';
import { EmployeeService } from './team/team.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DashboardComponent implements OnInit, OnDestroy {
  greetingMsg: string = '';
  footerMsg: string = '';
  totalEmployees = 0;

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(private _employeeService: EmployeeService) {}

  ngOnInit(): void {
    const hour = getHours(new Date());
    let timeGreeting = '';
    if (hour < 12) {
      timeGreeting = 'Good Morning';
    } else if (hour < 18) {
      timeGreeting = 'Good Afternoon';
    } else {
      timeGreeting = 'Good Evening';
    }
    this.greetingMsg = `${timeGreeting} Admin, welcome back!`;

    const currentYear = new Date().getFullYear();
    this.footerMsg = `© ${currentYear} • Made with ❤️ by Ancode.`;

    this._employeeService
      .getEmployees()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.totalEmployees = res.pagination.totalItems;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }
}
