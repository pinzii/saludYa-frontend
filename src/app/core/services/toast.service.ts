import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Estructura del estado del toast activo. */
export interface ToastData {
  /** Texto del mensaje a mostrar al usuario. */
  mensaje: string;
  /** Tipo visual: 'success' (verde), 'error' (rojo), 'info' (azul). */
  tipo: 'success' | 'error' | 'info';
  /** Indica si el toast debe estar visible en pantalla. */
  visible: boolean;
}

/**
 * Servicio centralizado de notificaciones toast.
 *
 * Permite mostrar mensajes visuales no bloqueantes al usuario desde
 * cualquier componente. Utiliza un `BehaviorSubject` de RxJS para que
 * `ToastComponent` reaccione de forma reactiva a los cambios de estado.
 *
 * @example
 * // Mostrar un toast de éxito
 * this.toastService.mostrar('¡Cita reagendada con éxito!', 'success');
 *
 * // Mostrar un toast de error
 * this.toastService.mostrar('Error al conectar con la base de datos', 'error');
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  /** BehaviorSubject que mantiene el estado actual del toast. */
  private toastSubject = new BehaviorSubject<ToastData>({
    mensaje: '',
    tipo: 'success',
    visible: false
  });

  /** Observable que los componentes suscriben para reaccionar a los cambios del toast. */
  toast$ = this.toastSubject.asObservable();

  /**
   * Muestra un mensaje toast y lo oculta automáticamente después de 3.5 segundos.
   *
   * @param mensaje - Texto a mostrar en la notificación.
   * @param tipo - Tipo visual del toast. Por defecto 'success'.
   */
  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' = 'success') {
    this.toastSubject.next({ mensaje, tipo, visible: true });

    setTimeout(() => {
      this.ocultar();
    }, 3500);
  }

  /**
   * Oculta el toast activo estableciendo `visible` en `false`.
   */
  ocultar() {
    this.toastSubject.next({ ...this.toastSubject.value, visible: false });
  }
}