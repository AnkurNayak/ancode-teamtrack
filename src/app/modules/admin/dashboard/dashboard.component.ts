import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { getHours } from 'date-fns';
import { EmployeeService } from './team/team.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DashboardComponent implements OnInit {
  greetingMsg: string = '';
  footerMsg: string = '';
  totalEmployees = 0;

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

    this._employeeService.getEmployees().subscribe((res) => {
      this.totalEmployees = res.pagination.totalItems;
    });
  }
}
