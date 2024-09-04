import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  signupError: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSignup() {
    if (this.signupForm.invalid) {
      return;
    }
  
    const { username, email, password } = this.signupForm.value;
  
    // Register the user
    this.authService.register(username, email, password).subscribe({
      next: response => {
        console.log('Signup successful', response);
  
        // Redirect to login after successful signup
        this.router.navigate(['']);
      },
      error: signupError => {
        console.error('Signup failed', signupError);
        this.signupError = signupError.error.message || 'Signup failed. Please try again.';
      }
    });
  }

  switchToLogin(): void {
    this.router.navigate(['']); // Navigate back to the login page
  }
}
