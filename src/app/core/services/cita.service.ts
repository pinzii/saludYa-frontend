import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita.model';

/**
 * Servicio de gestión de citas médicas.
 *
 * Centraliza todas las operaciones CRUD sobre el recurso `/api/appointments`
 * del backend. Cada petición incluye automáticamente el JWT del usuario
 * gracias al interceptor global de HttpClient configurado en `app.config.ts`.
 */
@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private api = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las citas del usuario autenticado desde la base de datos.
   *
   * El backend filtra automáticamente las citas por el `pacienteId`
   * extraído del JWT, de modo que cada usuario solo ve sus propias citas.
   *
   * @returns Observable que emite un arreglo de `Cita`.
   */
  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.api);
  }

  /**
   * Persiste una nueva cita en la base de datos PostgreSQL.
   *
   * @param cita - Objeto `Cita` con los datos del agendamiento:
   *   especialidad, fecha, hora, sede, médico, observaciones y estado.
   * @returns Observable que emite la `Cita` creada con su `id` asignado por la BD.
   */
  crearCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.api, cita);
  }

  /**
   * Actualiza parcialmente una cita existente en la base de datos.
   *
   * Se utiliza para dos operaciones:
   * - **Cancelar:** envía `{ estado: 'Cancelada' }`.
   * - **Reagendar:** envía `{ fecha, hora, estado: 'Pendiente' }`.
   *
   * @param id - Identificador único de la cita a actualizar.
   * @param cita - Campos parciales de `Cita` que se desean modificar.
   * @returns Observable que emite la `Cita` actualizada.
   */
  actualizarCita(id: number, cita: Partial<Cita>): Observable<Cita> {
    return this.http.put<Cita>(`${this.api}/${id}`, cita);
  }
}
