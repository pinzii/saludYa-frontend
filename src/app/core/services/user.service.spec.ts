import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UsersService } from './user.service'; 
import { environment } from '../../../environments/environment';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener un usuario por ID e incluir el header de Cache-Control', () => {
    const mockUserId = 1;
    const mockResponse = { id: 1, nombre: 'Camilo', ciudad: 'Bogotá' };

    service.getUser(mockUserId).subscribe((user) => {
      expect(user).toEqual(mockResponse);
    });

    // Interceptamos la petición
    const req = httpMock.expectOne(`${apiUrl}/${mockUserId}`);
    expect(req.request.method).toBe('GET');
    
    // Verificamos que el header personalizado se esté enviando correctamente
    expect(req.request.headers.get('Cache-Control')).toBe('no-cache');
    
    req.flush(mockResponse);
  });

  it('debería actualizar los datos de un usuario mediante PUT', () => {
    const mockUserId = 1;
    const updateData = { nombre: 'Camilo Actualizado', telefono: '3001234567' };
    const mockResponse = { id: 1, ...updateData };

    service.updateUser(mockUserId, updateData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/${mockUserId}`);
    expect(req.request.method).toBe('PUT');
    
    // Verificamos que el cuerpo de la petición contenga los datos a actualizar
    expect(req.request.body).toEqual(updateData);
    
    req.flush(mockResponse);
  });
});