import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupComponent } from './group.component';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import Peer from 'peerjs';

describe('GroupComponent', () => {
  let component: GroupComponent;
  let fixture: ComponentFixture<GroupComponent>;
  let mockAuthService = jasmine.createSpyObj('AuthService', ['getUserFromSession']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  let mockActivatedRoute = {
    snapshot: { paramMap: { get: (key: string) => '1' } }
  };
  let mockSocket = jasmine.createSpyObj<Socket>('Socket', ['emit', 'on', 'disconnect']);
  let mockPeer = jasmine.createSpyObj('Peer', ['call', 'disconnect', 'on']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: 'Socket', useValue: mockSocket }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupComponent);
    component = fixture.componentInstance;
    mockAuthService.getUserFromSession.and.returnValue({ _id: '123', username: 'testUser', avatar: 'avatar.png' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load group details and messages on init', () => {
    spyOn(component, 'loadGroupDetails');
    spyOn(component, 'loadMessages');
    
    component.ngOnInit();
    
    expect(component.loadGroupDetails).toHaveBeenCalledWith('1');
    expect(component.loadMessages).toHaveBeenCalled();
    expect(mockSocket.emit).toHaveBeenCalledWith('joinGroup', '1');
  });

  it('should send a message', () => {
    component.newMessage = 'Hello';
    component.sendMessage();
    expect(mockSocket.emit).toHaveBeenCalledWith('sendMessage', jasmine.objectContaining({
      groupId: '1',
      senderId: '123',
      senderName: 'testUser',
      content: 'Hello'
    }));
  });

  it('should clear newMessage after sending a message', () => {
    component.newMessage = 'Test message';
    component.sendMessage();
    expect(component.newMessage).toBe('');
  });

  it('should navigate to dashboard when returnToDashboard is called', () => {
    component.returnToDashboard();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should disconnect socket and peer on destroy', () => {
    spyOn(component, 'endVideoChat');
    component.ngOnDestroy();
    expect(component.endVideoChat).toHaveBeenCalled();
    expect(mockPeer.disconnect).toHaveBeenCalled();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
