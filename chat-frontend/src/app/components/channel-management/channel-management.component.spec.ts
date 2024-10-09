import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelComponent } from './channel-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ChannelService } from '../../services/channel.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChannelComponent', () => {
  let component: ChannelComponent;
  let fixture: ComponentFixture<ChannelComponent>;
  let mockChannelService = jasmine.createSpyObj('ChannelService', ['getChannels', 'updateChannel', 'createChannel', 'deleteChannel']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  let mockActivatedRoute = {
    snapshot: { paramMap: { get: (key: string) => '1' } }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ChannelService, useValue: mockChannelService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load channels on init', () => {
    const mockChannels = [{ id: 1, name: 'General' }];
    mockChannelService.getChannels.and.returnValue(of(mockChannels));

    component.ngOnInit();

    expect(mockChannelService.getChannels).toHaveBeenCalledWith('1');
    expect(component.channels).toEqual(mockChannels);
  });

  it('should select a channel for editing', () => {
    const mockChannel = { id: 1, name: 'General' };
    component.selectChannel(mockChannel);

    expect(component.selectedChannel).toEqual(mockChannel);
    expect(component.isEditing).toBeTrue();
  });

  it('should reset form on resetForm call', () => {
    component.resetForm();

    expect(component.channelForm.value.channelName).toBe('');
    expect(component.selectedChannel).toBeNull();
    expect(component.isEditing).toBeFalse();
  });

  it('should navigate back to group page', () => {
    component.returnToGroup();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/group/1']);
  });
});
