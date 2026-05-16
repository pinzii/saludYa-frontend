import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastData {
  mensaje: string;
  tipo: 'success' | 'error' | 'info';
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Estado inicial del toast (oculto)
  private toastSubject = new BehaviorSubject<ToastData>({
    mensaje: '',
    tipo: 'success',
    visible: false
  });

  // Observable para que el componente escuche los cambios
  toast$ = this.toastSubject.asObservable();

  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' = 'success') {
    this.toastSubject.next({ mensaje, tipo, visible: true });

    // Auto-ocultar después de 3.5 segundos
    setTimeout(() => {
      this.ocultar();
    }, 3500);
  }

  ocultar() {
    this.toastSubject.next({ ...this.toastSubject.value, visible: false });
  }
}