import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  userForm: FormGroup;
  isEditing = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      roles: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = data;
    });
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.isEditing = true;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      roles: user.roles.join(', ')
    });
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const updatedUser = {
        ...this.selectedUser,
        ...this.userForm.value,
        roles: this.userForm.value.roles.split(',').map((role: string) => role.trim())
      };
  
      if (this.isEditing) {
        this.userService.updateUser(updatedUser._id, updatedUser).subscribe(() => {
          this.loadUsers();
          this.resetForm();
        });
      } else {
        this.userService.addUser(updatedUser).subscribe(() => {
          this.loadUsers();
          this.resetForm();
        });
      }
    }
  }

  deleteUser(user: any): void {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.userService.deleteUser(user._id).subscribe({
        next: () => {
          this.loadUsers();
          if (this.selectedUser?._id === user._id) {
            this.resetForm();
          }
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('There was an issue deleting the user. Please try again.');
        }
      });
    }
  }

  makeGroupAdmin(user: any): void {
    user.roles = ['Group Admin'];
    this.userService.updateUser(user._id, user).subscribe(() => {
      this.loadUsers();
    });
  }

  makeSuperAdmin(user: any): void {
    user.roles = ['Super Admin'];
    this.userService.updateUser(user._id, user).subscribe(() => {
      this.loadUsers();
    });
  }

  isGroupAdmin(user: any): boolean {
    return user.roles.includes('Group Admin');
  }

  isSuperAdmin(user: any): boolean {
    return user.roles.includes('Super Admin');
  }

  resetForm(): void {
    this.userForm.reset();
    this.selectedUser = null;
    this.isEditing = false;
  }

  addUser(): void {
    this.resetForm();
    this.isEditing = false;
  }

  returnToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  
}
