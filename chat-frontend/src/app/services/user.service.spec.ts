import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', () => {
    const mockUsers = [{ id: '1', username: 'User1' }];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:3000/user/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get a user by ID', () => {
    const mockUser = { id: '1', username: 'User1' };

    service.getUserById('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should update a user', () => {
    const mockUser = { id: '1', username: 'UpdatedUser' };

    service.updateUser('1', mockUser).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/user/users/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockUser);
  });

  it('should delete a user', () => {
    service.deleteUser('1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:3000/user/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle errors', () => {
    service.getUsers().subscribe({
      error: (error) => {
        expect(error.message).toBe('Error in user service; please try again later.');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/user/users');
    req.flush('Error message', { status: 500, statusText: 'Server Error' });
  });
});
