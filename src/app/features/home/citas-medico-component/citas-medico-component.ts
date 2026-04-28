import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-citas-medico-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-medico-component.html',
  styleUrl: './citas-medico-component.css',
})
export class CitasMedicoComponent {
citas = [
    {
      paciente: 'Juan Pérez',
      especialidad: 'Odontología general',
      fecha: '2026-04-20',
      hora: '08:00 AM',
      sede: 'Sede Centro',
      estado: 'Confirmada'
    },
    {
      paciente: 'María Gómez',
      especialidad: 'Ortodoncia',
      fecha: '2026-04-20',
      hora: '10:30 AM',
      sede: 'Sede Norte',
      estado: 'Pendiente'
    },
    {
      paciente: 'Carlos Ramírez',
      especialidad: 'Endodoncia',
      fecha: '2026-04-21',
      hora: '02:00 PM',
      sede: 'Sede Sur',
      estado: 'Cancelada'
    }
  ];


}
