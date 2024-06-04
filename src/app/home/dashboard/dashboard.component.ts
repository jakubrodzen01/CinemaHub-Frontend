import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Weather {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  name: string;
}

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
  weather: Weather | null = null;
  apiKey: string = 'b0d65b7ecdd291c1e43810539b10f5a0';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUserData();
    this.generateWelcomeMessage();
    this.getLocation();
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

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  getWeather(lat: number, lon: number) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    this.http.get<Weather>(url).subscribe(
      (data) => {
        this.weather = data;
      },
      (error) => {
        console.error('Error fetching weather data', error);
      }
    );
  }
}
