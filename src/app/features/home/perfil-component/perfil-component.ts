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

  id = 1;
  form = {
    nombre: '',
    email: '',
    documento: '',
    telefono: '',
    password: ''
  };

  loading = false;
  mensaje = '';
  error: string | null = null;

  constructor(private usersService: UsersService, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.id = this.authService.getUserIdFromToken()!;
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.loading = true;
    this.usersService.getUser(this.id).subscribe({
      next: (user: any) => {
        this.form.nombre = user.nombre;
        this.form.email = user.email;
        this.form.documento = user.documento;
        this.form.telefono = user.telefono;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error cargando usuario';
      }
    });
  }

  actualizar() {
    this.loading = true;
    this.mensaje = '';
    this.error = '';
    const data: any = {
      nombre: this.form.nombre,
      email: this.form.email,
      documento: this.form.documento,
      telefono: this.form.telefono
    };

    if (this.form.password) {
      data.password = this.form.password;
    }

    this.usersService.updateUser(this.id, data).subscribe({
      next: () => {
        this.mensaje = 'Datos actualizados correctamente';
        this.form.password = '';
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.mensaje = '';
          this.cdr.detectChanges()
        }, 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al actualizar';
        this.loading = false;
      }
    });
  }

}
