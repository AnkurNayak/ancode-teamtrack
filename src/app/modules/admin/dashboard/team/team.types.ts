export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  dateOfJoining: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EmployeeFilters {
  department?: string[];
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'dateOfJoining';
  sortOrder?: 'asc' | 'desc';
}

export interface EmployeeResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface EmployeeList {
  employees: Employee[];
  totalItems: number;
  lastPage: number;
}
