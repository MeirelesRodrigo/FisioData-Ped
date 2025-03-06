import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private validUser = {user: 'fisioPed@123', password: 'fisioPed@123'}

  constructor(private router: Router) {}

  login(user: string, password: string){
    if(user === this.validUser.user && password === this.validUser.password){
      localStorage.setItem('auth', 'true');
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('auth') === 'true';
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}
