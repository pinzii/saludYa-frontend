import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agendar-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar-component.html',
  styleUrl: './agendar-component.css',
})
export class AgendarComponent {

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
  const citasGuardadas = JSON.parse(localStorage.getItem('citas') || '[]');

  const existeCita = citasGuardadas.some((cita: any) =>
    cita.fecha === this.filtro.fecha &&
    cita.hora === item.hora &&
    cita.estado !== 'Cancelada'
  );

  if (existeCita) {
    this.error = 'Ya tienes una cita agendada en esa fecha y hora';
    this.mensaje = '';
    return;
  }

  const cita = {
    id: Date.now(),
    especialidad: this.filtro.especialidad,
    fecha: this.filtro.fecha,
    observaciones: this.filtro.observaciones,
    sede: item.sede,
    hora: item.hora,
    medico: item.medico,
    estado: 'Pendiente'
  };

  citasGuardadas.push(cita);

  localStorage.setItem('citas', JSON.stringify(citasGuardadas));

  this.mensaje = 'Cita agendada correctamente';
  this.error = '';

  this.filtro = {
  especialidad: '',
  fecha: '',
  observaciones: ''
};

this.resultados = [];

  setTimeout(() => {
    this.mensaje = '';
  }, 3000);
}


}