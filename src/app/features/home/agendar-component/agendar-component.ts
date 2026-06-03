import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../../core/services/cita.service'; 
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-agendar-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar-component.html',
  styleUrl: './agendar-component.css',
})

export class AgendarComponent {
  constructor(
    private citaService: CitaService,
    private cdr: ChangeDetectorRef
  ) {}

  filtro = {
    especialidad: '',
    fecha: '',
    observaciones: ''
  };

  resultados: any[] = [];
  mensaje = '';
  error = '';
  cargando = false; // Flag para evitar el doble envío

  buscar() {
    this.mensaje = '';
    this.error = '';

    if (!this.filtro.especialidad || !this.filtro.fecha) {
      this.error = 'Selecciona una especialidad y una fecha para buscar disponibilidad';
      return;
    }

    this.resultados = this.generarHorariosDisponibles(7, 18);  
    this.cdr.detectChanges();  
  }

  generarHorariosDisponibles(horaInicio: number, horaFin: number): any[] {
  const horarios = [];
  const sedes = ['Sede Norte', 'Sede Centro', 'Sede Sur'];
  const medicos = {
    'Odontología': ['Dr. Juan Pérez', 'Dra. Ana Ríos'],
    'Periodoncia': ['Dr. Carlos Ramírez'],
    'General': ['Dra. María Gómez']
  };

  // Obtenemos médicos para la especialidad seleccionada o genéricos
  const listaMedicos = (medicos as any)[this.filtro.especialidad] || ['Médico de Turno'];

  for (let h = horaInicio; h < horaFin; h++) {
    // Formato AM/PM para la vista
    const horaFormateada = h >= 12 
      ? `${h === 12 ? 12 : h - 12}:00 PM` 
      : `${h}:00 AM`;

    horarios.push({
      sede: sedes[Math.floor(Math.random() * sedes.length)], // Sede aleatoria para variedad
      hora: horaFormateada,
      medico: listaMedicos[Math.floor(Math.random() * listaMedicos.length)]
    });
  }
  return horarios;

  }

  seleccionarCita(item: any) {
    if (this.cargando) return; // Si ya hay una petición en curso, no hace nada

    this.error = '';
    this.mensaje = '';
    this.cargando = true;
    this.cdr.detectChanges(); // Forzar actualización para mostrar el estado de carga

    
    const nuevaCita: Cita = {
      especialidad: this.filtro.especialidad,
      fecha: this.filtro.fecha, 
      observaciones: this.filtro.observaciones || '',
      sede: item.sede,
      hora: item.hora,
      medico: item.medico,
      estado: 'Pendiente'
    };

    console.log('Enviando a PostgreSQL:', nuevaCita);

    this.citaService.crearCita(nuevaCita).subscribe({
      next: (resultado) => {
        console.log('Respuesta del servidor:', resultado);
        this.mensaje = '¡Cita agendada con éxito en SaludYa!';
        this.cargando = false;
        this.resultados = []; // Limpiamos los horarios
        this.cdr.detectChanges();
        
        // No limpiamos el formulario de golpe para que el usuario vea el mensaje
        setTimeout(() => {
          this.limpiarFormulario();
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err) => {
        this.error = 'Error de conexión: No se pudo persistir la cita en la base de datos';
        this.cargando = false;
        this.cdr.detectChanges();
        console.error('Error detallado:', err);
      }
    });
  }

  limpiarFormulario() {
    this.filtro = {
      especialidad: '',
      fecha: '',
      observaciones: ''
    };
    this.resultados = [];
    this.mensaje = '';
  }
}