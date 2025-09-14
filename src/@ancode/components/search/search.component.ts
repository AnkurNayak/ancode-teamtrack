import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent {
  @Input() searchInput: string = '';
  @Output() searchInputChange = new EventEmitter<string>();

  constructor() {}

  onChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput = value;
    this.searchInputChange.emit(value);
  }
}
