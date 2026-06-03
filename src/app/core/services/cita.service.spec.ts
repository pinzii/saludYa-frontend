import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CitaService } from './cita.service'; 
import { environment } from '../../../environments/environment';
import { Cita } from '../models/cita.model';

describe('CitaService', () => {
  let service: CitaService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/appointments`;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
        CitaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CitaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener la lista de citas mediante GET', () => {
    const mockCitas: Cita[] = [
      { especialidad: 'General', fecha: '2026-06-10', sede: 'Sede Norte', hora: '10:00 AM', medico: 'Dr. Pérez', estado: 'Pendiente' }
    ];

    service.getCitas().subscribe((citas) => {
      expect(citas.length).toBe(1);
      expect(citas).toEqual(mockCitas);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCitas);
  });

  it('debería crear una nueva cita mediante POST', () => {
    const nuevaCita: Cita = { especialidad: 'Odontología', fecha: '2026-06-11', sede: 'Sede Sur', hora: '11:00 AM', medico: 'Dra. Ríos', estado: 'Pendiente' };
    const mockRespuesta = { ...nuevaCita, id: 1 }; 

    service.crearCita(nuevaCita).subscribe((respuesta) => {
      expect(respuesta).toEqual(mockRespuesta as any);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevaCita); 
    req.flush(mockRespuesta);
  });

  it('debería actualizar una cita existente mediante PUT', () => {
    const idCita = 123;
    const cambios: Partial<Cita> = { estado: 'Confirmada' };
    const mockRespuesta = { id: 123, estado: 'Confirmada', especialidad: 'General' };

    service.actualizarCita(idCita, cambios).subscribe((respuesta) => {
      expect(respuesta).toEqual(mockRespuesta as any);
    });

    const req = httpMock.expectOne(`${apiUrl}/${idCita}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cambios);
    req.flush(mockRespuesta);
  });
});