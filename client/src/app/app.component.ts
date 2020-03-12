import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { User } from './models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private loginService: LoginService) {
      this.loginService.currentUser.subscribe(x => this.currentUser = x);
  }

  public logout(): void {
    // Logout and navigate to login page
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
