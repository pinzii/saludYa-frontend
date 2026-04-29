import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-citas-component',
  imports: [CommonModule],
  templateUrl: './citas-component.html',
  styleUrl: './citas-component.css',
})
export class CitasComponent {
  
  mensaje = '';
  citas: any[] = [];

  ngOnInit() {
    this.cargarCitas();
    this.actualizarEstados();
  }

  cargarCitas() {
    this.citas = JSON.parse(localStorage.getItem('citas') || '[]');
  }

  cancelarCita(id: number) {
  const confirmar = confirm('¿Seguro que deseas cancelar esta cita?');

  if (!confirmar) return;

  this.citas = this.citas.map(cita => {
    if (cita.id !== id) {
      return cita;
    }

    if (cita.estado === 'Cancelada' || cita.estado === 'Completada') {
      return cita;
    }

    return {
      ...cita,
      estado: 'Cancelada'
    };
  });

  localStorage.setItem('citas', JSON.stringify(this.citas));

  this.mensaje = 'Cita cancelada correctamente';

  setTimeout(() => {
    this.mensaje = '';
  }, 3000);
}

actualizarEstados() {

  const ahora = new Date();

  this.citas = this.citas.map(cita => {

    if (cita.estado === 'Cancelada') {
      return cita;
    }

    const fechaHoraCita = new Date(
      `${cita.fecha} ${this.convertirHora24(cita.hora)}`
    );

    if (fechaHoraCita < ahora) {
      return {
        ...cita,
        estado: 'Completada'
      };
    }

    return cita;

  });

  localStorage.setItem('citas', JSON.stringify(this.citas));
}

convertirHora24(hora: string): string {

  const [time, modifier] = hora.split(' ');

  let [hours, minutes] = time.split(':');

  if (modifier === 'PM' && hours !== '12') {
    hours = String(parseInt(hours) + 12);
  }

  if (modifier === 'AM' && hours === '12') {
    hours = '00';
  }

  return `${hours}:${minutes}:00`;
}

  
}