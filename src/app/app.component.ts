import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconsServicesService } from './services/icons-service/icons-services.service'
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FioData';
  isLoginPage = false;
  constructor(
    public iconsService : IconsServicesService,
    private router: Router
  ){
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/';
    })
  }
}
