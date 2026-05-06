import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../../core/services/cita.service'; 
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-agendar-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar-component.html',
  styleUrl: './agendar-component.css',
})
export class AgendarComponent {

 constructor(private citaService: CitaService) {}

  filtro = {
    especialidad: '',
    fecha: '',
    observaciones: ''
  };

  resultados: any[] = [];
  mensaje = '';
  error = '';

  buscar() {
    this.mensaje = '';
    this.error = '';

    if (!this.filtro.especialidad || !this.filtro.fecha) {
      this.error = 'Selecciona una especialidad y una fecha para buscar disponibilidad';
      return;
    }

    this.resultados = [
      {
        sede: 'Sede Centro',
        hora: '08:00 AM',
        medico: 'Dr. Juan Pérez'
      },
      {
        sede: 'Sede Norte',
        hora: '10:30 AM',
        medico: 'Dra. María Gómez'
      },
      {
        sede: 'Sede Sur',
        hora: '02:00 PM',
        medico: 'Dr. Carlos Ramírez'
      }
    ];
  }

 seleccionarCita(item: any) {
  this.error = '';
  this.mensaje = '';

  const nuevaCita: Cita = {
    especialidad: this.filtro.especialidad,
    fecha: this.filtro.fecha,
    observaciones: this.filtro.observaciones,
    sede: item.sede,
    hora: item.hora,
    medico: item.medico,
    estado: 'Pendiente'
  };

  // Llamada real al backend
  this.citaService.crearCita(nuevaCita).subscribe({
    next: (resultado) => {      
      this.mensaje = 'Cita agendada correctamente en el sistema';
      this.limpiarFormulario(); // Función para resetear los campos
    },
    error: (err) => {
      this.error = 'Error de conexión: No se pudo persistir la cita';
      console.error(err);
    }
  });
}

// Esta función reseteará el formulario a su estado original
limpiarFormulario() {
  this.filtro = {
    especialidad: '',
    fecha: '',
    observaciones: ''
  };
    this.resultados = []; // Limpia la tabla de resultados
  
    setTimeout(() => {
    this.mensaje = '';
    }, 3000);
}


}