import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: false,
})
export class TableComponent {
  @Input() columns: { key: string; label: string; type?: string }[] = [];
  @Input() rows: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  selectedRows = new Set<number>();
  actionRowId: string | null = null;

  hasActions(): boolean {
    return true;
  }

  toggleActionDropdown(rowId: string) {
    this.actionRowId = this.actionRowId === rowId ? null : rowId;
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }

  toggleRowSelection(id: number) {
    this.selectedRows.has(id) ? this.selectedRows.delete(id) : this.selectedRows.add(id);
  }

  isRowSelected(id: number): boolean {
    return this.selectedRows.has(id);
  }

  selectAll(rows: any[]) {
    const allSelected = rows.every((row) => this.selectedRows.has(row.id));
    if (allSelected) {
      this.selectedRows.clear();
    } else {
      rows.forEach((row) => this.selectedRows.add(row.id));
    }
  }

  isAllSelected(rows: any[]): boolean {
    return rows.length > 0 && rows.every((row) => this.selectedRows.has(row.id));
  }

  getBadgeClass(columnKey: string, value: string): string {
    if (columnKey === 'department') {
      switch (value.toLowerCase()) {
        case 'hr':
          return 'bg-blue-100 text-blue-800';
        case 'engineering':
          return 'bg-green-100 text-green-800';
        case 'sales':
          return 'bg-yellow-100 text-yellow-800';
        case 'marketing':
          return 'bg-indigo-100 text-indigo-800';
        case 'finance':
          return 'bg-purple-100 text-purple-800';
        case 'operations':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-blue-500';
      }
    }
    return '';
  }
}
