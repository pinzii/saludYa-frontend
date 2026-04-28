import { Component } from '@angular/core';
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
  errorMessage: string | null = null;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  login() {
    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.login(data).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    });
  }

}
