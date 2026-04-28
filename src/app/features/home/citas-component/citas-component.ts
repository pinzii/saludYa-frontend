import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-citas-component',
  imports: [CommonModule],
  templateUrl: './citas-component.html',
  styleUrl: './citas-component.css',
})
export class CitasComponent {

 citas = [
    {
      especialidad: 'Odontología general',
      fecha: '2026-04-10',
      hora: '09:00 AM',
      medico: 'Dr. Juan Pérez',
      sede: 'Sede Centro',
      estado: 'Completada'
    },
    {
      especialidad: 'Ortodoncia',
      fecha: '2026-04-20',
      hora: '11:00 AM',
      medico: 'Dra. María Gómez',
      sede: 'Sede Norte',
      estado: 'Pendiente'
    },
    {
      especialidad: 'Endodoncia',
      fecha: '2026-03-15',
      hora: '02:30 PM',
      medico: 'Dr. Carlos Ramírez',
      sede: 'Sede Sur',
      estado: 'Cancelada'
    }
  ];

}
