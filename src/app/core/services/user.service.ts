import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private api = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}
  
  getUser(id: number) {
  return this.http.get(`${this.api}/${id}`, {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
}
  
  updateUser(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }
}