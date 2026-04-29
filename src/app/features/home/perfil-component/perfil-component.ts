import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../core/services/user.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-perfil-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-component.html',
  styleUrl: './perfil-component.css',
})
export class PerfilComponent {

  
  id!: number;

  form = {
    nombre: '',
    email: '',
    documento: '',
    telefono: ''
  };

  loading = false;
  mensaje = '';
  error: string | null = null;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const userId = this.authService.getUserIdFromToken();

    if (!userId) {
      this.error = 'No se pudo identificar el usuario';
      return;
    }

    this.id = userId;
    this.cargarUsuario();
  }

  

  cargarUsuario() {
    this.loading = false;
    this.error = null;

    this.usersService.getUser(this.id).subscribe({
      next: (user: any) => {
        this.form.nombre = user.nombre || '';
        this.form.email = user.email || '';
        this.form.documento = user.documento || '';
        this.form.telefono = user.telefono || '';

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error cargando usuario';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  actualizar() {

    console.log('click actualizar');
    this.mensaje = '';
    this.error = null;

    if (!this.form.nombre.trim() || !this.form.email.trim() || !this.form.documento.trim() || !this.form.telefono.trim()) {
      this.error = 'Completa todos los datos faltantes antes de actualizar';
      return;
    }

    this.loading = true;

    const data = {
      nombre: this.form.nombre,
      email: this.form.email,
      documento: this.form.documento,
      telefono: this.form.telefono
    };

    this.usersService.updateUser(this.id, data).subscribe({
      next: (user: any) => {
        this.form.nombre = user.nombre || '';
        this.form.email = user.email || '';
        this.form.documento = user.documento || '';
        this.form.telefono = user.telefono || '';

        this.mensaje = 'Datos actualizados correctamente';
        this.loading = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.mensaje = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al actualizar los datos';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}