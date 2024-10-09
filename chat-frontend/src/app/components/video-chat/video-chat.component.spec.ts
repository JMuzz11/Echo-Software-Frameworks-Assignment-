import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoChatComponent } from './video-chat.component';
import Peer, { PeerJSOption, DataConnection, MediaConnection } from 'peerjs';

describe('VideoChatComponent', () => {
  let component: VideoChatComponent;
  let fixture: ComponentFixture<VideoChatComponent>;
  let mockPeer = jasmine.createSpyObj('Peer', ['call', 'on', 'destroy']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoChatComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoChatComponent);
    component = fixture.componentInstance;
    component.peer = mockPeer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize peer on init', () => {
    spyOn(mockPeer, 'on').and.callFake((event: string, callback: (id: string) => void) => {
      if (event === 'open') {
        callback('peer-id');
      }
    });

    component.ngOnInit();

    expect(mockPeer.on).toHaveBeenCalledWith('open', jasmine.any(Function));
    expect(component.peerId).toBe('peer-id');
  });

  it('should make a call', async () => {
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve({} as MediaStream));
    spyOn(mockPeer, 'call');

    await component.makeCall();

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ video: true, audio: true });
    expect(mockPeer.call).toHaveBeenCalled();
  });

  it('should handle incoming calls', () => {
    spyOn(component, 'answerCall');
    component.ngOnInit();
    mockPeer.on.calls.argsFor(1)[1]({} as MediaConnection); // Simulate a call event

    expect(component.answerCall).toHaveBeenCalled();
  });

  it('should destroy peer on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(mockPeer.destroy).toHaveBeenCalled();
  });
});
