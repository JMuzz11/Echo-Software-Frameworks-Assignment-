import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChannelService } from './channel.service';

describe('ChannelService', () => {
  let service: ChannelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChannelService]
    });
    service = TestBed.inject(ChannelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get channels', () => {
    const mockChannels = [{ id: '1', name: 'General' }];

    service.getChannels('1').subscribe((channels) => {
      expect(channels).toEqual(mockChannels);
    });

    const req = httpMock.expectOne('http://localhost:3000/channel/1/channels');
    expect(req.request.method).toBe('GET');
    req.flush(mockChannels);
  });

  it('should create a channel', () => {
    const mockChannel = { id: '1', name: 'New Channel' };

    service.createChannel('1', 'New Channel').subscribe((channel) => {
      expect(channel).toEqual(mockChannel);
    });

    const req = httpMock.expectOne('http://localhost:3000/channel/1/channels');
    expect(req.request.method).toBe('POST');
    req.flush(mockChannel);
  });

  it('should update a channel', () => {
    const mockChannel = { id: '1', name: 'Updated Channel' };

    service.updateChannel('1', '1', 'Updated Channel').subscribe((channel) => {
      expect(channel).toEqual(mockChannel);
    });

    const req = httpMock.expectOne('http://localhost:3000/channel/1/channels/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockChannel);
  });

  it('should delete a channel', () => {
    service.deleteChannel('1', '1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:3000/channel/1/channels/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
