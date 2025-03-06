import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/login/auth.service.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  error: boolean = false

  loginForm = new FormGroup({
    user: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(private router: Router,
              private authService: AuthServiceService) { }

  submit() {
    const { user, password } = this.loginForm.value!
    if (this.authService.login(user!, password!)) {
      this.router.navigate(['listar'])
    } else {
      this.error = true
    }
  }
}
