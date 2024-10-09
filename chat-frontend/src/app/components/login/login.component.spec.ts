import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully', () => {
    component.loginForm.setValue({ username: 'testUser', password: 'password' });
    mockAuthService.login.and.returnValue(of({ token: '12345' }));

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('testUser', 'password');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error on failed login', () => {
    component.loginForm.setValue({ username: 'testUser', password: 'wrongPassword' });
    mockAuthService.login.and.returnValue(throwError({ error: { message: 'Login failed' } }));

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('testUser', 'wrongPassword');
    expect(component.loginError).toBe('Login failed');
  });

  it('should navigate to signup page when switchToSignup is called', () => {
    component.switchToSignup();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/signup']);
  });
});
