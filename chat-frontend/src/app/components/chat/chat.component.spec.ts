import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { io, Socket } from 'socket.io-client';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let mockAuthService = jasmine.createSpyObj('AuthService', ['getUserFromSession']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  let mockActivatedRoute = {
    queryParams: of({ groupId: '1' })
  };
  let mockSocket = jasmine.createSpyObj<Socket>('Socket', ['emit', 'on', 'disconnect']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
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
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    mockAuthService.getUserFromSession.and.returnValue({ _id: '123', username: 'testUser', avatar: 'avatar.png' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user and groupId on init', () => {
    component.ngOnInit();
    expect(component.currentUser).toEqual({ _id: '123', username: 'testUser', avatar: 'avatar.png' });
    expect(component.groupId).toBe('1');
    expect(mockSocket.emit).toHaveBeenCalledWith('joinGroup', '1');
  });

  it('should fetch messages for the group', () => {
    spyOn(component, 'loadMessages');
    component.ngOnInit();
    expect(component.loadMessages).toHaveBeenCalled();
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

  it('should disconnect socket on destroy', () => {
    component.ngOnDestroy();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
