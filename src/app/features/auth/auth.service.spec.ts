import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Secreto de Vitest: Espiar el prototipo es 100% seguro y no se rompe
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks(); // clearAllMocks limpia el historial, pero no mata al espía
  });

  it('debería hacer login y guardar el token', () => {
    const credentials = { email: 'test@test.com', password: '123' };
    const mockResponse = { access_token: 'fake-token' };

    service.login(credentials).subscribe();

    const req = httpMock.expectOne(`${apiUrl}auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(Storage.prototype.setItem).toHaveBeenCalledWith('token', 'fake-token');
  });

  it('debería registrar un usuario', () => {
    const data = { nombre: 'Juan' };
    service.register(data).subscribe();

    const req = httpMock.expectOne(`${apiUrl}users/register`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('debería hacer logout y remover el token', () => {
    service.logout();
    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('token');
  });

  it('debería obtener el token', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('my-token');
    expect(service.getToken()).toBe('my-token');
  });

  it('debería verificar si está autenticado', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('my-token');
    expect(service.isAuthenticated()).toBe(true);

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    expect(service.isAuthenticated()).toBe(false);
  });

  describe('Decodificación de Tokens (try/catch)', () => {
    const mockPayload = { sub: 123, rol: 'ADMIN' };
    const validToken = `header.${btoa(JSON.stringify(mockPayload))}.signature`;

    it('debería obtener el ID del usuario desde un token válido', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(validToken);
      expect(service.getUserIdFromToken()).toBe(123);
    });

    it('debería retornar null al obtener ID si no hay token', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('debería retornar null al obtener ID si el token es inválido', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('token-roto-sin-puntos');
      expect(service.getUserIdFromToken()).toBeNull();
    });

    it('debería obtener el rol del usuario desde un token válido', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(validToken);
      expect(service.getUserRole()).toBe('ADMIN');
    });

    it('debería retornar null al obtener rol si no hay token', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
      expect(service.getUserRole()).toBeNull();
    });

    it('debería retornar null al obtener rol si el token es inválido', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('token-roto');
      expect(service.getUserRole()).toBeNull();
    });
  });
});