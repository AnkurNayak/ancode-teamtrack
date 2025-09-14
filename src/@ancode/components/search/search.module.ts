import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SearchComponent],
  imports: [MatIconModule],
  exports: [SearchComponent],
})
export class SearchModule {}
