import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './core/services/auth.guard';
import {AdvertsComponent} from "./home/adverts/adverts.component";
import {ScheduleComponent} from "./home/schedule/schedule.component";
import {AvailabilityComponent} from "./home/availability/availability.component";
import {ProfileComponent} from "./home/profile/profile.component";
import {DashboardComponent} from "./home/dashboard/dashboard.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {EmployeeComponent} from "./home/employee/employee.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'adverts', component: AdvertsComponent },
      { path: 'availability', component: AvailabilityComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ] },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
