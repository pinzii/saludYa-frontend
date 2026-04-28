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

  buscar() {

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
}
