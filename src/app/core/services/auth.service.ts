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
          //zapisanie w local storage informacji z tokena
          const token = response.token;
          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(token);
          const username = decodedToken.sub;
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem('username', username);

          this.http.get<any>('http://localhost:8080/api/v1/user/getMe')
          .subscribe({
              next: me => {
                localStorage.setItem('me', JSON.stringify(me));
                localStorage.setItem('role', me.role);
                this.router.navigate(['/home']);
              },
              error: err => {
                console.error('GetMe error:', err);
              }
            });
        },
        error: err => {
          console.error('Login error:', err);
        }
      });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('username');
    localStorage.removeItem('me');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    const token = localStorage.getItem(this.tokenKey);
    return token && !this.jwtHelper.isTokenExpired(token);
  }
}
