import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

/**
 * Servicio de autenticación de SaludYa.
 *
 * Gestiona el ciclo de vida de la sesión del usuario: login, registro,
 * logout y extracción de datos desde el JWT almacenado en localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = `${environment.apiUrl}/api/`;

  constructor(private http: HttpClient) { }

  /**
   * Envía las credenciales al backend y almacena el JWT recibido en localStorage.
   *
   * @param credentials - Objeto con `email` y `password` del usuario.
   * @returns Observable que emite la respuesta del servidor con `access_token`.
   */
  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.api}auth/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
      })
    );
  }

  /**
   * Registra un nuevo usuario en el sistema.
   *
   * @param data - Datos del usuario: nombre, email, password y rol ('paciente' | 'medico').
   * @returns Observable con la respuesta del servidor.
   */
  register(data: any) {
    return this.http.post(`${this.api}users/register`, data);
  }

  /**
   * Cierra la sesión eliminando el token del almacenamiento local.
   */
  logout() {
    localStorage.removeItem('token');
  }

  /**
   * Obtiene el JWT almacenado en localStorage.
   *
   * @returns El token JWT como string, o `null` si no existe.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verifica si el usuario tiene una sesión activa comprobando la existencia del token.
   *
   * @returns `true` si hay un token en localStorage, `false` en caso contrario.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Extrae el ID del usuario (campo `sub`) del payload del JWT.
   *
   * @returns El ID numérico del usuario, o `null` si el token no existe o es inválido.
   */
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

  /**
   * Extrae el rol del usuario (campo `rol`) del payload del JWT.
   *
   * @returns El rol del usuario ('paciente' | 'medico'), o `null` si el token no es válido.
   */
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
