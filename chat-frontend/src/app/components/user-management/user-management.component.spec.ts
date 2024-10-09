import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let mockUserService = jasmine.createSpyObj('UserService', ['getUsers', 'updateUser', 'addUser', 'deleteUser']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserManagementComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const mockUsers = [{ _id: '1', username: 'user1', email: 'user1@example.com', roles: ['User'] }];
    mockUserService.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(mockUserService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should select a user for editing', () => {
    const mockUser = { _id: '1', username: 'user1', email: 'user1@example.com', roles: ['User'] };
    component.selectUser(mockUser);

    expect(component.selectedUser).toEqual(mockUser);
    expect(component.isEditing).toBeTrue();
    expect(component.userForm.value.username).toBe('user1');
  });

  it('should save a new user', () => {
    component.userForm.setValue({ username: 'newUser', email: 'newuser@example.com', roles: 'User' });
    mockUserService.addUser.and.returnValue(of({}));

    component.saveUser();

    expect(mockUserService.addUser).toHaveBeenCalled();
    expect(component.isEditing).toBeFalse();
  });

  it('should update an existing user', () => {
    const mockUser = { _id: '1', username: 'user1', email: 'user1@example.com', roles: ['User'] };
    component.selectUser(mockUser);
    component.userForm.setValue({ username: 'updatedUser', email: 'updated@example.com', roles: 'User' });
    mockUserService.updateUser.and.returnValue(of({}));

    component.saveUser();

    expect(mockUserService.updateUser).toHaveBeenCalledWith('1', jasmine.objectContaining({ username: 'updatedUser' }));
  });

  it('should delete a user', () => {
    const mockUser = { _id: '1', username: 'user1', email: 'user1@example.com', roles: ['User'] };
    spyOn(window, 'confirm').and.returnValue(true);
    mockUserService.deleteUser.and.returnValue(of({}));

    component.deleteUser(mockUser);

    expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
  });

  it('should navigate to dashboard', () => {
    component.returnToDashboard();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should reset the form', () => {
    component.resetForm();
    expect(component.userForm.value.username).toBe('');
    expect(component.selectedUser).toBeNull();
    expect(component.isEditing).toBeFalse();
  });

  it('should promote a user to Group Admin', () => {
    const mockUser = { _id: '1', username: 'user1', email: 'user1@example.com', roles: ['User'] };
    mockUserService.updateUser.and.returnValue(of({}));

    component.makeGroupAdmin(mockUser);

    expect(mockUserService.updateUser).toHaveBeenCalledWith('1', jasmine.objectContaining({ roles: ['Group Admin'] }));
  });

  it('should promote a user to Super Admin', () => {
    const mockUser = { _id: '1', username: 'user1', email: 'user1@example.com', roles: ['User'] };
    mockUserService.updateUser.and.returnValue(of({}));

    component.makeSuperAdmin(mockUser);

    expect(mockUserService.updateUser).toHaveBeenCalledWith('1', jasmine.objectContaining({ roles: ['Super Admin'] }));
  });
});
