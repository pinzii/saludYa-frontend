import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../../core/services/cita.service'; // Asegura la ruta
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-citas-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-component.html',
  styleUrl: './citas-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitasComponent implements OnInit {
  
  mensaje = '';
  error = '';
  citas: Cita[] = [];
  citaReagendando: any = null;
  nuevaFecha = '';
  nuevaHora = '';
  fechaHoy = new Date().toISOString().split('T')[0];

  citasPendientes: Cita[] = [];
  citasCompletadas: Cita[] = [];
  citasCanceladas: Cita[] = [];

  constructor(
    private citaService: CitaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarCitas();
  }

  // Carga desde PostgreSQL
  cargarCitas() {
    this.citaService.getCitas().subscribe({
      next: (data) => {
        // Primero procesamos los estados, luego ordenamos y al final asignamos
        const citasProcesadas = this.procesarEstados(data);
        this.citas = this.ordenarCitas(citasProcesadas);

        this.citasPendientes = this.citas.filter(c => c.estado === 'Pendiente');
        this.citasCompletadas = this.citas.filter(c => c.estado === 'Completada');
        this.citasCanceladas = this.citas.filter(c => c.estado === 'Cancelada');

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las citas';
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  // Cambiamos el nombre y la lógica para que sea una función pura
  procesarEstados(citasRecibidas: Cita[]): Cita[] {
    const ahora = new Date();
    return citasRecibidas.map(cita => {
      if (cita.estado === 'Cancelada' || cita.estado === 'Completada') return cita;

      // Intentamos parsear la fecha de forma segura
      const fechaHoraCita = new Date(`${cita.fecha}T${this.convertirHora24(cita.hora)}`);
      
      if (!isNaN(fechaHoraCita.getTime()) && fechaHoraCita < ahora) {
        return { ...cita, estado: 'Completada' as const };
      }
      return cita;
    });
  }

  // Método para cancelar en el Backend
  cancelarCita(id: number) {
    const confirmar = confirm('¿Seguro que deseas cancelar esta cita?');
    if (!confirmar) return;

    // Enviamos el cambio de estado al backend
    this.citaService.actualizarCita(id, { estado: 'Cancelada' }).subscribe({
      next: () => {
        this.mensaje = 'Cita cancelada correctamente';
        this.cargarCitas(); // Recargamos para ver el cambio
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: () => this.error = 'Error al cancelar la cita en el servidor'
    });
  }

  // Método para reagendar en el Backend
  guardarReagendamiento() {
    if (!this.nuevaFecha || !this.nuevaHora) {
      this.error = 'Selecciona nueva fecha y hora';
      return;
    }

    if (this.nuevaFecha < this.fechaHoy) {
      this.error = 'No puedes reagendar una cita a una fecha pasada';
      return;
    }

    const datosActualizados: Partial<Cita> = {
      fecha: this.nuevaFecha,
      hora: this.nuevaHora,
      estado: 'Pendiente'
    };

    this.citaService.actualizarCita(this.citaReagendando.id, datosActualizados).subscribe({
      next: () => {
        this.mensaje = 'Cita reagendada correctamente';
        this.citaReagendando = null;
        this.cargarCitas();
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: () => this.error = 'Error al actualizar la cita'
    });
  }

  // --- MÉTODOS DE APOYO (Lógica de negocio en el Front) ---

  private ordenarCitas(citas: Cita[]): Cita[] {
    return citas.sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${this.convertirHora24(a.hora)}`);
      const fechaB = new Date(`${b.fecha}T${this.convertirHora24(b.hora)}`);
      return fechaA.getTime() - fechaB.getTime();
    });
  } 

  convertirHora24(hora: string): string {
    if (!hora.includes(' ')) return hora; // Por si ya viene en formato 24h
    const [time, modifier] = hora.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours) + 12);
    if (modifier === 'AM' && hours === '12') hours = '00';
    return `${hours}:${minutes}:00`;
  }

  
  citaSeleccionada: any = null;
  verDetalle(cita: any) { this.citaSeleccionada = cita; }
  cerrarDetalle() { this.citaSeleccionada = null; }
  
  reagendarCita(cita: any) {
    if (cita.estado === 'Cancelada' || cita.estado === 'Completada') return;
    this.citaReagendando = cita;
    this.nuevaFecha = '';
    this.nuevaHora = '';
    this.error = '';
  }
}