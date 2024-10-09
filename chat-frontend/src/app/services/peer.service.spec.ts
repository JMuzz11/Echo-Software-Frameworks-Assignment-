import { TestBed } from '@angular/core/testing';
import { PeerService } from './peer.service';
import { Peer } from 'peerjs';

describe('PeerService', () => {
  let service: PeerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeerService]
    });
    service = TestBed.inject(PeerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a peer instance with a valid ID', () => {
    expect(service.myPeer).toBeTruthy();
    expect(service.myPeerId).toBeTruthy();
  });

  it('should handle peer connection', () => {
    spyOn(service.myPeer, 'on');
    service.myPeer.on('open', (id: string) => {
      expect(id).toBe(service.myPeerId);
    });
    expect(service.myPeer.on).toHaveBeenCalledWith('open', jasmine.any(Function));
  });

  it('should handle call', () => {
    const mockStream = {} as MediaStream;
    const mockCall = jasmine.createSpyObj('call', ['answer', 'on']);
    service.handleCall(mockCall, mockStream);
    expect(mockCall.answer).toHaveBeenCalledWith(mockStream);
    expect(mockCall.on).toHaveBeenCalledWith('stream', jasmine.any(Function));
  });
});
