import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-channel-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './channel-management.component.html',
  styleUrls: ['./channel-management.component.css']
})
export class ChannelManagementComponent implements OnInit {
  channels: any[] = [];
  channelForm: FormGroup;
  isEditing = false;
  selectedGroupId = 1; // Example group ID, update this dynamically if needed

  constructor(
    private fb: FormBuilder,
    private channelService: ChannelService,
    private authService: AuthService
  ) {
    this.channelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadChannels();
  }

  loadChannels() {
    this.channelService.getChannels(this.selectedGroupId).subscribe(channels => {
      this.channels = channels;
    });
  }

  selectChannel(channel: any) {
    this.isEditing = true;
    this.channelForm.patchValue(channel);
  }

  saveChannel() {
    if (this.channelForm.invalid) {
      return;
    }

    const channelData = this.channelForm.value;
    const channelName = channelData.name;

    if (this.isEditing) {
      this.channelService.updateChannel(this.selectedGroupId, channelData.id, channelName).subscribe(() => {
        this.loadChannels();
        this.resetForm();
      });
    } else {
      this.channelService.createChannel(this.selectedGroupId, channelName).subscribe(() => {
        this.loadChannels();
        this.resetForm();
      });
    }
  }

  deleteChannel(channel: any) {
    this.channelService.deleteChannel(this.selectedGroupId, channel.id).subscribe(() => {
      this.loadChannels();
    });
  }

  resetForm() {
    this.isEditing = false;
    this.channelForm.reset();
  }
}
