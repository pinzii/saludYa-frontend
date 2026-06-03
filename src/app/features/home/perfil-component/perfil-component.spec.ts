import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil-component';
import { UsersService } from '../../../core/services/user.service'; 
import { AuthService } from '../../auth/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let authServiceSpy: any;
  let usersServiceSpy: any;

  beforeEach(async () => {
    // Mocks de los servicios
    authServiceSpy = {
      getUserIdFromToken: vi.fn()
    };

    usersServiceSpy = {
      getUser: vi.fn(),
      updateUser: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PerfilComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  describe('Inicialización (ngOnInit y cargarUsuario)', () => {
    it('debería mostrar error si no hay usuario identificado en el token', () => {
      authServiceSpy.getUserIdFromToken.mockReturnValue(null);
      component.ngOnInit();
      expect(component.error).toBe('No se pudo identificar el usuario');
    });

    it('debería cargar el usuario correctamente si el token es válido', () => {
      authServiceSpy.getUserIdFromToken.mockReturnValue(1);
      const mockUser = { nombre: 'Test', email: 'test@test.com', documento: '123', telefono: '456' };
      usersServiceSpy.getUser.mockReturnValue(of(mockUser));

      component.ngOnInit();

      expect(component.id).toBe(1);
      expect(component.form.nombre).toBe('Test');
      expect(component.loading).toBe(false);
    });

    it('debería manejar el error si falla la carga del usuario desde la base de datos', () => {
      authServiceSpy.getUserIdFromToken.mockReturnValue(1);
      usersServiceSpy.getUser.mockReturnValue(throwError(() => new Error('Error')));

      component.ngOnInit();

      expect(component.error).toBe('Error cargando usuario');
      expect(component.loading).toBe(false);
    });
  });

  describe('Método actualizar()', () => {
    beforeEach(() => {
      component.id = 1; // Pre-configuramos el ID
    });

    it('debería mostrar error si faltan datos en el formulario (validación trim)', () => {
      component.form = { nombre: ' ', email: 'test@test.com', documento: '123', telefono: '456' };
      component.actualizar();
      expect(component.error).toBe('Completa todos los datos faltantes antes de actualizar');
    });

    it('debería actualizar los datos y limpiar el mensaje de éxito después de 3 segundos', () => {
      vi.useFakeTimers(); // Encendemos la máquina del tiempo

      component.form = { nombre: 'Test', email: 'test@test.com', documento: '123', telefono: '456' };
      const mockResponse = { nombre: 'Test Editado', email: 'test@test.com', documento: '123', telefono: '456' };
      
      usersServiceSpy.updateUser.mockReturnValue(of(mockResponse));

      component.actualizar();

      expect(component.mensaje).toBe('Datos actualizados correctamente');
      expect(component.form.nombre).toBe('Test Editado');
      expect(component.loading).toBe(false);

      vi.advanceTimersByTime(3000); // Avanzamos 3 segundos

      expect(component.mensaje).toBe('');
      
      vi.useRealTimers(); // Apagamos el reloj
    });

    it('debería manejar error al actualizar los datos en el servidor', () => {
      component.form = { nombre: 'Test', email: 'test@test.com', documento: '123', telefono: '456' };
      const mockError = { error: { message: 'El correo ya existe' } };
      usersServiceSpy.updateUser.mockReturnValue(throwError(() => mockError));

      component.actualizar();

      expect(component.error).toBe('El correo ya existe');
      expect(component.loading).toBe(false);
    });
  });
});