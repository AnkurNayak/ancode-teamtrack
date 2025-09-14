import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { InputComponent } from './input.component';
import { CalendarComponent } from '../calender/calendar.component';

@NgModule({
  declarations: [InputComponent],
  imports: [SharedModule, MatIconModule, CalendarComponent],
  exports: [InputComponent],
})
export class InputModule {}
