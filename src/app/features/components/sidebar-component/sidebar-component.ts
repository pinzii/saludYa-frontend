import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-component',
  imports: [RouterModule,CommonModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {

  rol: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


   ngOnInit() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);
    
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
