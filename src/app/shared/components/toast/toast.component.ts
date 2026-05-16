import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastData } from '../../../core/services/toast.service'; // Aseguramos la importación de la interfaz

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  // Tipamos la propiedad de la clase de forma segura
  data!: ToastData;

  constructor(
    private toastService: ToastService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // CORRECCIÓN: Le asignamos explícitamente el tipo 'ToastData' al parámetro
    this.toastService.toast$.subscribe((toast: ToastData) => {
      this.data = toast;
      this.cdr.detectChanges(); 
    });
  }

  cerrar() {
    this.toastService.ocultar();
  }
}