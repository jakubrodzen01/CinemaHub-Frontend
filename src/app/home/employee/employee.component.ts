import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  role: string | null = localStorage.getItem('role');
  showModal: boolean = false;
  showConfirmModal: boolean = false;
  selectedEmployeeId: string | null = null;

  newEmployee = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    role: 'EMPLOYEE'
  };

  constructor(private employeeService: EmployeeService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe(
      (employees: any) => {
        this.employees = employees.sort((a: any, b: any) => a.lastName.localeCompare(b.lastName));
      },
      (error: any) => {
        console.error('Error loading employees:', error);
      }
    );
  }

  openConfirmModal(id: string) {
    this.selectedEmployeeId = id;
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.selectedEmployeeId = null;
  }

  deleteEmployee() {
    const token = localStorage.getItem('auth_token');
    if (this.selectedEmployeeId && token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.delete(`http://localhost:8080/api/v1/user/delete/${this.selectedEmployeeId}`, { headers }).subscribe(
        () => {
          this.loadEmployees();
          this.closeConfirmModal();
        },
        error => {
          console.error('Error deleting employee:', error);
        }
      );
    } else {
      console.error('Missing ID or token');
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  clearNewEmployee() {
    this.newEmployee = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      role: 'EMPLOYEE'
    };
  }

  addEmployee() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.post('http://localhost:8080/api/v1/user/add', this.newEmployee, { headers }).subscribe(
        () => {
          this.loadEmployees();
          this.closeModal();
          this.clearNewEmployee();
        },
        error => {
          console.error('Error adding employee:', error);
          console.log('Headers:', headers);
          console.log('Employee Data:', this.newEmployee);
        }
      );
    } else {
      console.error('Missing token');
    }
  }
}
