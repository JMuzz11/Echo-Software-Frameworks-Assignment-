import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  userForm: FormGroup;
  isEditing = false;

  constructor(
    private authService: AuthService,
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

  // Load users from the service
  loadUsers(): void {
    this.userService.getUsers().subscribe((data: any[]) => {
      console.log('users loaded', data)
      this.users = data;
    });
  }

  // Select a user for editing
  selectUser(user: any): void {
    this.selectedUser = user;
    this.isEditing = true;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      roles: user.roles.join(', ')
    });
  }

  // Save user after editing or adding
  saveUser(): void {
    if (this.userForm.valid) {
      const updatedUser = {
        ...this.selectedUser,
        ...this.userForm.value,
        roles: this.userForm.value.roles.split(',').map((role: string) => role.trim())
      };
      
      if (this.isEditing) {
        this.userService.updateUser(updatedUser).subscribe(() => {
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

  // Delete a user
  deleteUser(user: any): void {
    this.userService.deleteUser(user.id).subscribe(() => {
      this.loadUsers();
      if (this.selectedUser?.id === user.id) {
        this.resetForm();
      }
    });
  }

  // Promote a user to SUPER ADMIN
  makeSuperAdmin(user: any): void {
    user.roles.push('Super Admin');
    this.userService.updateUser(user).subscribe(() => {
      this.loadUsers(); // Refresh the users list after updating
    });
  }

  // Check if the user is already a SUPER ADMIN
  isSuperAdmin(user: any): boolean {
    return user.roles.includes('Super Admin');
  }

  // Reset the form
  resetForm(): void {
    this.userForm.reset();
    this.selectedUser = null;
    this.isEditing = false;
  }

  // Add a new user
  addUser(): void {
    this.resetForm();
    this.isEditing = false;
  }

  // Navigate back to the dashboard
  returnToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
