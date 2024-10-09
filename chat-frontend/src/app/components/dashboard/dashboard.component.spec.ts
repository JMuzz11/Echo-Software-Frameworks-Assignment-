import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockGroupService = jasmine.createSpyObj('GroupService', ['getGroupsForUser', 'addChannelToGroup']);
  let mockAuthService = jasmine.createSpyObj('AuthService', ['getUserFromSession']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: GroupService, useValue: mockGroupService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockAuthService.getUserFromSession.and.returnValue({ _id: '123', username: 'testUser' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load groups for the current user on init', () => {
    const mockGroups = [{ _id: '1', name: 'Group 1' }];
    mockGroupService.getGroupsForUser.and.returnValue(of(mockGroups));

    component.ngOnInit();

    expect(mockGroupService.getGroupsForUser).toHaveBeenCalledWith('123');
    expect(component.groups).toEqual(mockGroups);
  });

  it('should navigate to group page when goToGroup is called', () => {
    component.goToGroup('1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/group/1']);
  });

  it('should navigate to manage users when manageUsers is called', () => {
    component.manageUsers();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should clear session storage and navigate to login on logout', () => {
    spyOn(sessionStorage, 'clear');
    component.logout();
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should upload avatar and update user data in session storage', () => {
    // This can be further implemented by mocking file input and HTTP request if necessary.
  });

  it('should add a channel to a group when addChannel is called', () => {
    const mockGroup = { _id: '1', name: 'Group 1' };
    spyOn(window, 'prompt').and.returnValue('New Channel');
    const updatedGroup = { _id: '1', name: 'Group 1', channels: ['New Channel'] };
    mockGroupService.addChannelToGroup.and.returnValue(of(updatedGroup));

    component.addChannel(mockGroup);

    expect(mockGroupService.addChannelToGroup).toHaveBeenCalledWith('1', 'New Channel');
  });
});
