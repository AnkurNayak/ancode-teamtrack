import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of, tap } from 'rxjs';
import { Employee, EmployeeFilters, EmployeeResponse } from './team.types';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '@ancode/services/common/storage.service';
import { compareAsc, compareDesc, parseISO } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly STORAGE_KEY = 'employee_db';
  private _employees$ = new BehaviorSubject<Employee[]>([]);

  constructor(private _storageService: StorageService) {
    const initialEmployees = this._getStorageEmployees();
    this._employees$.next(initialEmployees);
  }

  /**
   * Get storage employees
   */
  private _getStorageEmployees = (): Employee[] =>
    this._storageService.getItem(this.STORAGE_KEY) || [];

  private _saveStorageEmployee = (employees: Employee[]): void => {
    this._storageService.setItem(this.STORAGE_KEY, employees);
    this._employees$.next(employees);
  };

  private _refetchEmployeeData(): void {
    const employees = this._getStorageEmployees();
    this._employees$.next(employees);
  }

  createEmployee(
    employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Employee> {
    const newEmployee: Employee = {
      ...employeeData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const prevEmployees = this._getStorageEmployees();
    const updatedEmployees = [...prevEmployees, newEmployee];
    this._saveStorageEmployee(updatedEmployees);
    this._refetchEmployeeData();
    return of(newEmployee);
  }

  getEmployees(filters?: EmployeeFilters): Observable<EmployeeResponse<Employee>> {
    return this._employees$.pipe(
      map((employeeList) => {
        // Immute list: store in diff var
        let updatedEmployeeList = [...employeeList];

        // Search : name || email
        if (filters?.search) {
          const searchInp = filters.search.toLowerCase();
          updatedEmployeeList = updatedEmployeeList.filter(
            (employee: Employee) =>
              employee.name.toLowerCase().includes(searchInp) ||
              employee.email.toLowerCase().includes(searchInp)
          );
        }

        // Filter : department : multiple
        if (filters?.department && filters.department.length > 0) {
          const selectedDepartments = filters.department.map((dept) => dept.toLowerCase());
          updatedEmployeeList = updatedEmployeeList.filter((employee: Employee) =>
            selectedDepartments.includes(employee.department.toLowerCase())
          );
        }

        // Sort: name
        if (filters?.sortBy === 'name') {
          updatedEmployeeList.sort((firstEmp: Employee, secondEmp: Employee) => {
            const employeeFirst = firstEmp.name.toLowerCase();
            const employeeSecond = secondEmp.name.toLowerCase();
            const comparison =
              employeeFirst < employeeSecond ? -1 : employeeFirst > employeeSecond ? 1 : 0;
            return filters.sortOrder === 'asc' ? comparison : -comparison;
          });
        }

        // Sort : Joining
        if (filters?.sortBy === 'dateOfJoining') {
          const sortDate = filters.sortOrder === 'desc' ? compareDesc : compareAsc;
          updatedEmployeeList.sort((firstEmp: Employee, secondEmp: Employee) =>
            sortDate(parseISO(firstEmp.dateOfJoining), parseISO(secondEmp.dateOfJoining))
          );
        }

        // Pagination
        const totalItems = updatedEmployeeList.length;
        let exportedList = updatedEmployeeList;

        const currentPage = filters?.page || 1;
        const pageSize = filters?.pageSize || totalItems;

        if (filters?.page && filters?.pageSize) {
          const startIndex = (currentPage - 1) * pageSize;
          exportedList = updatedEmployeeList.slice(startIndex, startIndex + pageSize);
        }

        const totalPages = pageSize ? Math.ceil(totalItems / pageSize) : 1;

        return {
          data: exportedList,
          pagination: {
            currentPage,
            pageSize,
            totalItems,
            totalPages,
          },
        };
      })
    );
  }

  updateEmployee(
    id: string,
    employeeData: Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>
  ): Observable<Employee | null> {
    const currentEmployees = this._getStorageEmployees();
    const employeeIndex = currentEmployees.findIndex((employee) => employee.id === id);

    if (employeeIndex === -1) {
      return of(null);
    }

    // Updated employee withupdatedAt
    const updatedEmployee: Employee = {
      ...currentEmployees[employeeIndex],
      ...employeeData,
      updatedAt: new Date(),
    };
    const updatedEmployees = currentEmployees.map((employee, index) =>
      index === employeeIndex ? updatedEmployee : employee
    );

    this._saveStorageEmployee(updatedEmployees);
    this._refetchEmployeeData();

    return of(updatedEmployee);
  }

  // getEmployeeById(id: string): Observable<Employee | undefined> {
  //   return this._employees$.pipe(
  //     map((employees) => employees.find((employee) => employee.id === id))
  //   );
  // }

  deleteEmployeeById(id: string): Observable<boolean> {
    return this._employees$.pipe(
      map((employees) => {
        const employeeIndex = employees.findIndex((employee) => employee.id === id);

        if (employeeIndex === -1) {
          return false;
        }
        const updatedEmployees = employees.filter((employee) => employee.id !== id);

        this._saveStorageEmployee(updatedEmployees);
        this._refetchEmployeeData();

        return true;
      })
    );
  }
}
