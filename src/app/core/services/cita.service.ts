import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private api = `${environment.apiUrl}/api/appointments`;

  constructor(private http: HttpClient) {}

  // Obtener todas las citas del usuario actual
  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.api);
  }

  // Crear una nueva cita (Persistencia)
  crearCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.api, cita);
  }

  // Actualizar una cita (Reagendar)
  actualizarCita(id: number, cita: Partial<Cita>): Observable<Cita> {
    return this.http.put<Cita>(`${this.api}/${id}`, cita);
  }
}