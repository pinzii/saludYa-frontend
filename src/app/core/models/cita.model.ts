export interface Cita {
  id?: number;
  pacienteId?: number;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  sede: string;
  observaciones?: string;
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Completada';
}