import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groupId!: number;
  channels: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService
  ) {}

  ngOnInit() {
    this.groupId = +this.route.snapshot.paramMap.get('groupId')!;
    this.loadChannels();
  }

  loadChannels() {
    this.channelService.getChannels(this.groupId.toString()).subscribe(channels => {
      this.channels = channels;
    });
  }
}
