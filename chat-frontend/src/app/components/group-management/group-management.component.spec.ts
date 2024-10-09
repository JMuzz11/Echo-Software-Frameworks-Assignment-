import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupManagementComponent } from './group-management.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GroupManagementComponent', () => {
  let component: GroupManagementComponent;
  let fixture: ComponentFixture<GroupManagementComponent>;
  let mockGroupService = jasmine.createSpyObj('GroupService', ['getGroups', 'createGroup', 'updateGroup', 'deleteGroup', 'getGroupById', 'addUserToGroup']);
  let mockUserService = jasmine.createSpyObj('UserService', ['getUsers']);
  let mockAuthService = jasmine.createSpyObj('AuthService', ['getUserFromSession']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupManagementComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: GroupService, useValue: mockGroupService },
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupManagementComponent);
    component = fixture.componentInstance;
    mockAuthService.getUserFromSession.and.returnValue({ _id: '123', username: 'testUser' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load groups and users on init', () => {
    const mockGroups = [{ _id: '1', name: 'Group 1' }];
    const mockUsers = [{ _id: '1', username: 'User 1' }];
    mockGroupService.getGroups.and.returnValue(of(mockGroups));
    mockUserService.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(mockGroupService.getGroups).toHaveBeenCalled();
    expect(component.groups).toEqual(mockGroups);
    expect(mockUserService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should select a group for editing', () => {
    const mockGroup = { _id: '1', name: 'Group 1', members: [] };
    mockGroupService.getGroupById.and.returnValue(of(mockGroup));

    component.selectGroup(mockGroup);

    expect(component.isEditing).toBeTrue();
    expect(component.groupId).toBe('1');
    expect(component.groupForm.value.name).toBe('Group 1');
  });

  it('should save a group', () => {
    component.groupForm.setValue({ name: 'New Group', description: 'Description' });
    mockGroupService.createGroup.and.returnValue(of({}));

    component.saveGroup();

    expect(mockGroupService.createGroup).toHaveBeenCalled();
    expect(component.isEditing).toBeFalse();
  });

  it('should delete a group', () => {
    const mockGroup = { _id: '1', name: 'Group 1' };
    mockGroupService.deleteGroup.and.returnValue(of({}));

    component.deleteGroup(mockGroup);

    expect(mockGroupService.deleteGroup).toHaveBeenCalledWith('1');
  });

  it('should navigate to dashboard', () => {
    component.returnToDashboard();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should add user to group', () => {
    component.selectedUserId = '1';
    mockGroupService.addUserToGroup.and.returnValue(of({}));

    component.addUserToGroup('groupId');

    expect(mockGroupService.addUserToGroup).toHaveBeenCalledWith('groupId', '1');
  });
});
