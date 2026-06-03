import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendarComponent } from './agendar-component';
import { CitaService } from '../../../core/services/cita.service';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest'; 
import { By } from '@angular/platform-browser';

describe('AgendarComponent', () => {
  let component: AgendarComponent;
  let fixture: ComponentFixture<AgendarComponent>;
  let citaServiceSpy: any;

  beforeEach(async () => {
    // 1. Sintaxis 100% Vitest
    citaServiceSpy = {
      crearCita: vi.fn().mockReturnValue(of({ success: true }))
    };

    await TestBed.configureTestingModule({
      imports: [AgendarComponent],
      providers: [
        { provide: CitaService, useValue: citaServiceSpy },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Método buscar()', () => {
    it('debería mostrar un error si la especialidad o la fecha están vacías', () => {
      component.filtro.especialidad = '';
      component.filtro.fecha = '';
      component.buscar();
      
      expect(component.error).toBe('Selecciona una especialidad y una fecha para buscar disponibilidad');
      expect(component.resultados.length).toBe(0);
    });

    it('debería generar horarios disponibles si los filtros son correctos', () => {
      component.filtro.especialidad = 'Odontología';
      component.filtro.fecha = '2026-06-10';
      component.buscar();
      
      expect(component.error).toBe('');
      expect(component.resultados.length).toBeGreaterThan(0); 
    });
  });

  describe('Método seleccionarCita()', () => {
    it('no debería hacer nada si ya hay una petición cargando', () => {
      component.cargando = true;
      component.seleccionarCita({ sede: 'Sede Norte' });
      
      expect(citaServiceSpy.crearCita).not.toHaveBeenCalled();
    });

    it('debería agendar cita con éxito y limpiar el formulario después de 2 segundos', () => {
      // 1. Encendemos el reloj falso de Vitest
      vi.useFakeTimers(); 
      
      citaServiceSpy.crearCita.mockReturnValue(of({ id: 1, estado: 'creado' }));
      
      component.filtro = { especialidad: 'General', fecha: '2026-06-10', observaciones: 'Dolor leve' };
      const citaSimulada = { sede: 'Sede Centro', hora: '10:00 AM', medico: 'Dra. María Gómez' };

      component.seleccionarCita(citaSimulada);

      expect(component.mensaje).toBe('¡Cita agendada con éxito en SaludYa!');
      expect(component.cargando).toBe(false);
      expect(component.resultados.length).toBe(0);

      // 2. Le decimos a Vitest que adelante el reloj 2000 milisegundos de golpe
      vi.advanceTimersByTime(2000);

      expect(component.filtro.especialidad).toBe('');
      expect(component.mensaje).toBe('');

      // 3. Apagamos el reloj falso para no afectar otras pruebas
      vi.useRealTimers(); 
    });

    it('debería mostrar error si el servidor o la base de datos fallan', () => {
      // Sintaxis Vitest para simular error
      citaServiceSpy.crearCita.mockReturnValue(throwError(() => new Error('Error de base de datos')));

      component.seleccionarCita({ sede: 'Sede Sur' });

      expect(component.error).toBe('Error de conexión: No se pudo persistir la cita en la base de datos');
      expect(component.cargando).toBe(false);
    });
  });

  describe('Método limpiarFormulario()', () => {
    it('debería restablecer todas las variables a su estado inicial', () => {
      component.filtro.especialidad = 'Periodoncia';
      component.resultados = [{ hora: '12:00 PM' }];
      component.mensaje = 'Mensaje temporal';

      component.limpiarFormulario();

      expect(component.filtro.especialidad).toBe('');
      expect(component.resultados.length).toBe(0);
      expect(component.mensaje).toBe('');
    });
  });

  describe('Fase 2: Pruebas de Integración (DOM + TypeScript)', () => {
    
    it('Prueba 1 (Vista -> Controlador): Debería mostrar alerta de error en el HTML si se busca sin datos', () => {
      // 1. Encontramos el botón de submit directamente en el HTML y le hacemos clic
      const botonBuscar = fixture.debugElement.query(By.css('.btn-schedule')).nativeElement;
      botonBuscar.click();
      
      // 2. Le decimos a Angular que actualice el HTML tras el clic
      fixture.detectChanges(); 

      // 3. Verificamos que el div de error realmente apareció renderizado en el DOM
      const alertaError = fixture.debugElement.query(By.css('.alert-error'));
      expect(alertaError).toBeTruthy(); // Verifica que el elemento existe en el HTML
      expect(alertaError.nativeElement.textContent).toContain('Selecciona una especialidad');
    });

    it('Prueba 2 (Controlador -> Vista): Debería renderizar las tarjetas de horarios en el HTML al buscar con éxito', () => {
      // 1. Llenamos los datos en la lógica del componente
      component.filtro.especialidad = 'Odontología general';
      component.filtro.fecha = '2026-06-15';
      
      // 2. Simulamos el clic en el botón
      const botonBuscar = fixture.debugElement.query(By.css('.btn-schedule')).nativeElement;
      botonBuscar.click();
      fixture.detectChanges(); 

      // 3. Verificamos que la sección de resultados y las tarjetas (ngFor) se pintaron en el HTML
      const tarjetaResultados = fixture.debugElement.query(By.css('.results-card'));
      const listaHorarios = fixture.debugElement.queryAll(By.css('.result-item'));
      
      expect(tarjetaResultados).toBeTruthy();
      expect(listaHorarios.length).toBeGreaterThan(0); // Verifica que el *ngFor iteró elementos
    });

    it('Prueba 3 (DOM -> Servicio -> Vista): Debería llamar al servicio y mostrar éxito en el HTML al hacer clic en "Seleccionar"', () => {
      vi.useFakeTimers();
      // Preparamos el mock del servicio para que responda con éxito
      citaServiceSpy.crearCita.mockReturnValue(of({ success: true }));

      // Preparamos el escenario inyectando un resultado simulado
      component.filtro = { especialidad: 'General', fecha: '2026-06-10', observaciones: '' };
      component.resultados = [{ sede: 'Sede Norte', hora: '10:00 AM', medico: 'Dr. Pérez' }];
      fixture.detectChanges(); // Renderizamos el HTML para que aparezca el botón "Seleccionar"

      // 1. Encontramos el botón ".btn-select" del primer resultado y le hacemos clic
      const botonSeleccionar = fixture.debugElement.query(By.css('.btn-select')).nativeElement;
      botonSeleccionar.click();
      fixture.detectChanges(); 

      // 2. Verificamos que el clic en el HTML logró comunicarse con el servicio HTTP
      expect(citaServiceSpy.crearCita).toHaveBeenCalled();

      // 3. Verificamos que el mensaje de éxito se renderizó en la vista
      const mensajeExito = fixture.debugElement.query(By.css('.alert-success'));
      expect(mensajeExito).toBeTruthy();
      expect(mensajeExito.nativeElement.textContent).toContain('¡Cita agendada con éxito');

      vi.advanceTimersByTime(2000); // Limpiamos el setTimeout para no afectar otras pruebas
      vi.useRealTimers();
    });

  });

});