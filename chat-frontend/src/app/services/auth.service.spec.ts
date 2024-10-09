import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login a user and store user data in session storage', () => {
    const mockResponse = { user: { _id: '1', username: 'testUser' } };

    service.login('testUser', 'password').subscribe((response) => {
      expect(response.user.username).toBe('testUser');
      expect(sessionStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user));
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register a user', () => {
    const mockResponse = { message: 'User registered successfully' };

    service.register('testUser', 'test@example.com', 'password').subscribe((response) => {
      expect(response.message).toBe('User registered successfully');
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should remove user data from session storage on logout', () => {
    sessionStorage.setItem('user', JSON.stringify({ _id: '1', username: 'testUser' }));
    service.logout();
    expect(sessionStorage.getItem('user')).toBeNull();
  });

  it('should get user from session storage', () => {
    sessionStorage.setItem('user', JSON.stringify({ _id: '1', username: 'testUser' }));
    const user = service.getUserFromSession();
    expect(user.username).toBe('testUser');
  });

  it('should handle error responses', () => {
    service.login('testUser', 'wrongPassword').subscribe({
      error: (error) => {
        expect(error.message).toBe('Error in authentication service; please try again later.');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    req.flush('Error message', { status: 500, statusText: 'Server Error' });
  });
});
