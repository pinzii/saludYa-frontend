import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-component',
  imports: [RouterModule, FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {

  form = {
    nombre: '',
    email: '',
    password: '',
    password2: '',
    rol: 'paciente'
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar() {
    if (this.form.password !== this.form.password2) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const data = {
      nombre: this.form.nombre,
      email: this.form.email,
      password: this.form.password,
      rol: this.form.rol
    };

    this.authService.register(data).subscribe({
      next: () => {
        alert('Usuario registrado');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}