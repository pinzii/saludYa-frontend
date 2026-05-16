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
  
  terminoBusqueda: string = '';

  mensaje = '';
  error = '';
  citas: Cita[] = [];
  
  nuevaFecha = '';
  nuevaHora = '';
  fechaHoy = new Date().toISOString().split('T')[0];

  citasPendientes: Cita[] = [];
  citasCompletadas: Cita[] = [];
  citasCanceladas: Cita[] = [];  
  citaParaReagendar: Cita | null = null; 
  nuevaHoraReagendar: string = ''; 

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
       
        const citasProcesadas = this.procesarEstados(data);
        this.citas = this.ordenarCitas(citasProcesadas);

        this.filtrarCitasEnTiempoReal();

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las citas';
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  // Nueva función para el buscador reactivo
filtrarCitasEnTiempoReal() {
  const termino = this.terminoBusqueda.toLowerCase().trim();

  if (!termino) {
    // Si el buscador está vacío, se distribuyen todas las citas normalmente
    this.citasPendientes = this.citas.filter(c => c.estado === 'Pendiente');
    this.citasCompletadas = this.citas.filter(c => c.estado === 'Completada');
    this.citasCanceladas = this.citas.filter(c => c.estado === 'Cancelada');
  } else {
    // Si hay texto, filtramos el arreglo maestro 'this.citas' por especialidad o médico
    this.citasPendientes = this.citas.filter(c => 
      c.estado === 'Pendiente' && 
      (c.especialidad?.toLowerCase().includes(termino) || c.medico?.toLowerCase().includes(termino))
    );
    this.citasCompletadas = this.citas.filter(c => 
      c.estado === 'Completada' && 
      (c.especialidad?.toLowerCase().includes(termino) || c.medico?.toLowerCase().includes(termino))
    );
    this.citasCanceladas = this.citas.filter(c => 
      c.estado === 'Cancelada' && 
      (c.especialidad?.toLowerCase().includes(termino) || c.medico?.toLowerCase().includes(termino))
    );
  }

  // Notificamos a la vista del cambio (esencial por el OnPush)
  this.cdr.detectChanges();
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
  // Validamos que la variable que usa el HTML no sea null
  if (!this.citaParaReagendar) {
    this.error = 'No hay una cita seleccionada para actualizar';
    return;
  }

  const [horas, minutos] = this.nuevaHora.split(':').map(Number);
    
  if (horas < 7 || horas > 18 || (horas === 18 && minutos > 0)) {
    this.error = 'El horario de atención es 07:00 AM a 06:00 PM.';
    this.cdr.detectChanges();
    return; // Bloqueamos el subscribe
  }
  this.error = '';

  if (!this.nuevaFecha || !this.nuevaHora) {
    this.error = 'Selecciona nueva fecha y hora';
    this.cdr.detectChanges(); 
    return;
  }

  if (this.nuevaFecha < this.fechaHoy) {
    this.error = 'No puedes reagendar una cita a una fecha pasada';
    this.cdr.detectChanges();
    return;
  }

  const datosActualizados: Partial<Cita> = {
    fecha: this.nuevaFecha,
    hora: this.nuevaHora,
    estado: 'Pendiente'
  };  
  
  this.citaService.actualizarCita(this.citaParaReagendar.id!, datosActualizados).subscribe({
    next: () => {
      this.mensaje = 'Cita reagendada correctamente';  
      
      this.nuevaHora = '';
      this.nuevaFecha = '';    
      
      this.citaParaReagendar = null; 
      
      this.cargarCitas(); 
      this.cdr.detectChanges();

      setTimeout(() => {
        this.mensaje = '';
        this.cdr.detectChanges();
      }, 3000);
    },
    error: (err) => {
      this.error = 'Error al actualizar la cita';
      console.error(err);
      this.cdr.detectChanges();
    }
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
    this.citaParaReagendar = cita;
    this.nuevaFecha = '';
    this.nuevaHora = '';
    this.error = '';
  }

  prepararReagendar(cita: Cita) {
  this.error = '';
  this.mensaje = '';  
  this.citaParaReagendar = cita;

  this.nuevaHoraReagendar = cita.hora;
  console.log('Abriendo modal para:', cita)

  this.cdr.detectChanges();
}
}