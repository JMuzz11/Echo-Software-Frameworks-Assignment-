import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GroupService } from './group.service';

describe('GroupService', () => {
  let service: GroupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupService]
    });
    service = TestBed.inject(GroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get groups', () => {
    const mockGroups = [{ id: '1', name: 'Group 1' }];

    service.getGroups().subscribe((groups) => {
      expect(groups).toEqual(mockGroups);
    });

    const req = httpMock.expectOne('http://localhost:3000/groups');
    expect(req.request.method).toBe('GET');
    req.flush(mockGroups);
  });

  it('should create a group', () => {
    const mockGroup = { id: '1', name: 'New Group' };

    service.createGroup(mockGroup).subscribe((group) => {
      expect(group).toEqual(mockGroup);
    });

    const req = httpMock.expectOne('http://localhost:3000/groups/create');
    expect(req.request.method).toBe('POST');
    req.flush(mockGroup);
  });

  it('should update a group', () => {
    const mockGroup = { id: '1', name: 'Updated Group' };

    service.updateGroup('1', mockGroup).subscribe((group) => {
      expect(group).toEqual(mockGroup);
    });

    const req = httpMock.expectOne('http://localhost:3000/groups/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockGroup);
  });

  it('should delete a group', () => {
    service.deleteGroup('1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:3000/groups/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get groups for a user', () => {
    const mockGroups = [{ id: '1', name: 'Group 1' }];

    service.getGroupsForUser('1').subscribe((groups) => {
      expect(groups).toEqual(mockGroups);
    });

    const req = httpMock.expectOne('http://localhost:3000/groups/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockGroups);
  });

  it('should add a user to a group', () => {
    const mockResponse = { message: 'User added successfully' };

    service.addUserToGroup('1', '1').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/groups/1/addUser');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
