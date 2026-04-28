import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar-component/sidebar-component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {}
