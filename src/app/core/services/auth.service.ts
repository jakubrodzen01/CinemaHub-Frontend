import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/user/authenticate';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) { }

  login(username: string, password: string) {
    return this.http.post<any>(this.apiUrl, { username, password })
      .subscribe({
        next: response => {
          localStorage.setItem(this.tokenKey, response.token);
          this.router.navigate(['/home']);
        },
        error: err => {
          console.error('Login error:', err);
        }
      });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    const token = localStorage.getItem(this.tokenKey);
    return token && !this.jwtHelper.isTokenExpired(token);
  }
}
