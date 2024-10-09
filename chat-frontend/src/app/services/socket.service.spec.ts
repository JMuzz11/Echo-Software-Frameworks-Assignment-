import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { io, Socket } from 'socket.io-client';

describe('SocketService', () => {
  let service: SocketService;
  let mockSocket: jasmine.SpyObj<Socket>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketService]
    });
    service = TestBed.inject(SocketService);
    mockSocket = jasmine.createSpyObj('Socket', ['emit', 'on', 'disconnect', 'connect']);
    service['socket'] = mockSocket; // Inject mock socket
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit peer ID', () => {
    service.emitPeerID('peer123');
    expect(mockSocket.emit).toHaveBeenCalledWith('peerID', 'peer123');
  });

  it('should receive peer ID', () => {
    mockSocket.on.and.callFake((event, callback) => {
      if (event === 'peerID') {
        callback('peer123');
      }
    });

    service.getPeerID().subscribe((id) => {
      expect(id).toBe('peer123');
    });

    expect(mockSocket.on).toHaveBeenCalledWith('peerID', jasmine.any(Function));
  });

  it('should disconnect and reconnect the socket', () => {
    service.disconnect();
    expect(mockSocket.disconnect).toHaveBeenCalled();

    service.reconnect();
    expect(mockSocket.connect).toHaveBeenCalled();
  });
});
