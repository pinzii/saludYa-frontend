import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = `${environment.apiUrl}/api/`;

  constructor(private http: HttpClient) { }


  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.api}auth/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.api}users/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }


  getUserIdFromToken(): number | null {

    const token = localStorage.getItem('token');

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub; 
    } catch (error) {
      return null;
    }
  }

  getUserRole(): string | null {

  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol;
  } catch {
    return null;
  }
}

}