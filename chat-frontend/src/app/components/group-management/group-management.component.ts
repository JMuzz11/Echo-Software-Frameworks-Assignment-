import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {
  groups: any[] = [];
  groupForm: FormGroup;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  selectGroup(group: any) {
    this.isEditing = true;
    this.groupForm.patchValue(group);
  }

  saveGroup() {
    if (this.groupForm.invalid) {
      return;
    }
  
    const groupData = this.groupForm.value;
    const currentUser = this.authService.getUserFromSession();  // Get current user from session
    const adminId = currentUser.id;  // Use the ID from the logged-in user
  
    const requestData = {
      groupName: groupData.name,
      adminId: adminId
    };
  
    if (this.isEditing) {
      this.groupService.updateGroup(groupData.id, requestData).subscribe(() => {
        this.loadGroups();
        this.resetForm();
      });
    } else {
      this.groupService.createGroup(requestData).subscribe(() => {
        this.loadGroups();
        this.resetForm();
      });
    }
  }
  

  deleteGroup(group: any) {
    this.groupService.deleteGroup(group.id).subscribe(() => {
      this.loadGroups(); // Refresh the list of groups after deletion
    }, error => {
      console.error('Error deleting group:', error);
    });
  }
  

  resetForm() {
    this.isEditing = false;
    this.groupForm.reset();
  }

  returnToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
