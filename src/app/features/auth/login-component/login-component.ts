import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-component',
  imports: [RouterModule, FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {

  email: string = "";
  password: string = "";
  errorMessage: string = ""; // Inicializado como texto vacío

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  login() {
    this.errorMessage = ""; // Limpiar error anterior

    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.login(data).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        // Capturamos el mensaje exacto que vimos en tu consola
        this.errorMessage = err.error?.message || 'Correo electrónico o contraseña incorrectos.';
        
        // ¡La orden estricta para repintar el HTML!
        this.cdr.detectChanges(); 
      }
    });
  }
}