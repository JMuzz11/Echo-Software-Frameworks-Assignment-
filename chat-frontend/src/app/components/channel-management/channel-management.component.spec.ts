import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelManagementComponent } from './channel-management.component';

describe('ChannelManagementComponent', () => {
  let component: ChannelManagementComponent;
  let fixture: ComponentFixture<ChannelManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
