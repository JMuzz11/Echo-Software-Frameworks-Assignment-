import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './message.service';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService]
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get messages for a group', () => {
    const mockMessages = [{ sender: 'User1', content: 'Hello' }];
    service.getMessages('1').subscribe((messages) => {
      expect(messages).toEqual(mockMessages);
    });

    const req = httpMock.expectOne('http://localhost:3000/groups/1/messages');
    expect(req.request.method).toBe('GET');
    req.flush(mockMessages);
  });

  it('should send a message', () => {
    const mockMessage = { sender: 'User1', content: 'Hello' };

    service.sendMessage('1', mockMessage).subscribe((response) => {
      expect(response).toEqual(mockMessage);
    });

    const req = httpMock.expectOne('http://localhost:3000/groups/1/messages');
    expect(req.request.method).toBe('POST');
    req.flush(mockMessage);
  });

  it('should handle errors', () => {
    service.getMessages('1').subscribe({
      error: (error) => {
        expect(error.message).toBe('Error in chat service; please try again later.');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/groups/1/messages');
    req.flush('Error message', { status: 500, statusText: 'Server Error' });
  });
});
