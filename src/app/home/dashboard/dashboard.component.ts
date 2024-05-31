import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  welcomeMessage: string = '';
  currentDate: Date = new Date();
  firstName: string = '';
  lastName: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadUserData();
    this.generateWelcomeMessage();
  }

  loadUserData() {
    const userData = localStorage.getItem('me');
    if (userData) {
      const me = JSON.parse(userData);
      this.firstName = me.firstName;
      this.lastName = me.lastName;
    }
  }

  generateWelcomeMessage() {
    this.welcomeMessage = `Welcome, ${this.firstName} ${this.lastName}!`;
  }
}
