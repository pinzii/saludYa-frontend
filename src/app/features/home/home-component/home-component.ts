import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar-component/sidebar-component';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {}