import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-citas-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-component.html',
  styleUrl: './citas-component.css',
})
export class CitasComponent {
  
  mensaje = '';
  error = '';
  citas: any[] = [];
  citaReagendando: any = null;
  nuevaFecha = '';
  nuevaHora = '';
  fechaHoy = new Date().toISOString().split('T')[0];

  


  ngOnInit() {
    this.cargarCitas();
    this.actualizarEstados();
  }

  cargarCitas() {
    this.citas = JSON.parse(localStorage.getItem('citas') || '[]');

    this.citas.sort((a, b) => {
      const fechaA = new Date(`${a.fecha} ${this.convertirHora24(a.hora)}`);
      const fechaB = new Date(`${b.fecha} ${this.convertirHora24(b.hora)}`);

      return fechaA.getTime() - fechaB.getTime();
    });
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

  get citasPendientes() {
  return this.citas.filter(cita => cita.estado === 'Pendiente');
  }

  get citasCompletadas() {
    return this.citas.filter(cita => cita.estado === 'Completada');
  }

  get citasCanceladas() {
    return this.citas.filter(cita => cita.estado === 'Cancelada');
  }

  citaSeleccionada: any = null;

  verDetalle(cita: any) {
    this.citaSeleccionada = cita;
  }

  cerrarDetalle() {
    this.citaSeleccionada = null;
  }  

  reagendarCita(cita: any) {
    if (cita.estado === 'Cancelada' || cita.estado === 'Completada') {
      return;
    }

    this.citaReagendando = cita;

    this.nuevaFecha = '';
    this.nuevaHora = '';
    this.error = '';
  }

  guardarReagendamiento() {

    if (!this.nuevaFecha || !this.nuevaHora) {
      this.error = 'Selecciona nueva fecha y hora';
      return;
    }

    this.error = '';

    if (this.nuevaFecha < this.fechaHoy) {
      this.error = 'No puedes reagendar una cita a una fecha pasada';
      return;
    }

    const citasGuardadas =
      JSON.parse(localStorage.getItem('citas') || '[]');

    const citasActualizadas =
      citasGuardadas.map((cita: any) => {

        if (cita.id === this.citaReagendando.id) {

          return {
            ...cita,
            fecha: this.nuevaFecha,
            hora: this.nuevaHora,
            estado: 'Pendiente'
          };

        }

        return cita;

      });

    localStorage.setItem('citas', JSON.stringify(citasActualizadas));

    this.citas = citasActualizadas;

    this.citaReagendando = null;

    this.nuevaFecha = '';
    this.nuevaHora = '';
    this.error = ''; 
    

    this.mensaje = 'Cita reagendada correctamente';    

    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }

}