import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Servicio de gestión de datos del usuario autenticado.
 *
 * Expone operaciones de consulta y actualización del perfil del paciente
 * sobre el recurso `/api/users` del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos del perfil de un usuario por su ID.
   *
   * Incluye el header `Cache-Control: no-cache` para garantizar
   * que siempre se reciban los datos más recientes del servidor,
   * evitando que el navegador sirva una versión cacheada desactualizada.
   *
   * @param id - ID numérico del usuario (extraído del JWT).
   * @returns Observable con el objeto de usuario: nombre, email, documento, teléfono.
   */
  getUser(id: number) {
    return this.http.get(`${this.api}/${id}`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
  }

  /**
   * Actualiza los datos del perfil de un usuario.
   *
   * @param id - ID numérico del usuario a actualizar.
   * @param data - Objeto con los campos a modificar: nombre, email, documento, teléfono.
   * @returns Observable con el objeto de usuario actualizado devuelto por el servidor.
   */
  updateUser(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }
}
