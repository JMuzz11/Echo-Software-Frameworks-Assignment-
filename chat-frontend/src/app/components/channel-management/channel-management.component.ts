import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-channel',
  standalone: true, // Indicating that this is a standalone component
  imports: [CommonModule, ReactiveFormsModule], // Import CommonModule and ReactiveFormsModule
  templateUrl: './channel-management.component.html',
  styleUrls: ['./channel-management.component.css']
})
export class ChannelComponent implements OnInit {
  groupId!: number;
  channels: any[] = [];
  selectedChannel: any = null;
  channelForm: FormGroup;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.channelForm = this.fb.group({
      channelName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    // Get the groupId from the route parameters
    this.groupId = parseInt(this.route.snapshot.paramMap.get('groupId') || '', 10);
    this.loadChannels();
  }

  // Load the channels for the current group
  loadChannels(): void {
    this.channelService.getChannels(this.groupId).subscribe((data: any[]) => {
      this.channels = data;
    });
  }

  // Select a channel for editing
  selectChannel(channel: any): void {
    this.selectedChannel = channel;
    this.isEditing = true;
    this.channelForm.patchValue({
      channelName: channel.name,
    });
  }

  // Save the channel (either add a new one or update an existing one)
  saveChannel(): void {
    if (this.channelForm.valid) {
      const channelData = this.channelForm.value;

      if (this.isEditing) {
        this.channelService.updateChannel(this.groupId, this.selectedChannel.id, channelData.channelName).subscribe(() => {
          this.loadChannels();
          this.resetForm();
        });
      } else {
        this.channelService.createChannel(this.groupId, channelData.channelName).subscribe(() => {
          this.loadChannels();
          this.resetForm();
        });
      }
    }
  }

  // Delete a channel
  deleteChannel(channel: any): void {
    this.channelService.deleteChannel(this.groupId, channel.id).subscribe(() => {
      this.loadChannels();
    });
  }

  // Reset the form
  resetForm(): void {
    this.channelForm.reset();
    this.selectedChannel = null;
    this.isEditing = false;
  }

  // Navigate back to the group page
  returnToGroup(): void {
    this.router.navigate([`/group/${this.groupId}`]);
  }
}
