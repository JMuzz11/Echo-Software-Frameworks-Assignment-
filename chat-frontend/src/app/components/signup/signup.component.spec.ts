import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService = jasmine.createSpyObj('AuthService', ['register']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register successfully', () => {
    component.signupForm.setValue({ username: 'testUser', email: 'test@example.com', password: 'password' });
    mockAuthService.register.and.returnValue(of({ message: 'Signup successful' }));

    component.onSignup();

    expect(mockAuthService.register).toHaveBeenCalledWith('testUser', 'test@example.com', 'password');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error on failed signup', () => {
    component.signupForm.setValue({ username: 'testUser', email: 'test@example.com', password: 'password' });
    mockAuthService.register.and.returnValue(throwError({ error: { message: 'Signup failed' } }));

    component.onSignup();

    expect(component.signupError).toBe('Signup failed. Please try again.');
  });

  it('should navigate to login page when switchToLogin is called', () => {
    component.switchToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
