import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService, private fb: FormBuilder) {
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
    this.authService.getUsers().subscribe((data: any[]) => {
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
        this.authService.updateUser(updatedUser).subscribe(() => {
          this.loadUsers();
          this.resetForm();
        });
      } else {
        this.authService.addUser(updatedUser).subscribe(() => {
          this.loadUsers();
          this.resetForm();
        });
      }
    }
  }

  deleteUser(user: any): void {
    this.authService.deleteUser(user.id).subscribe(() => {
      this.loadUsers();
      if (this.selectedUser?.id === user.id) {
        this.resetForm();
      }
    });
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
}
