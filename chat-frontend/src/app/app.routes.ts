import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { GroupManagementComponent } from './components/group-management/group-management.component';
import { SignupComponent } from './components/signup/signup.component';
import { GroupComponent } from './components/group/group.component';

import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'chat/:groupId', component: ChatComponent, canActivate: [authGuard] }, // Accept groupId as parameter
  { path: 'group/:groupId', component: GroupComponent, canActivate: [authGuard] },
  { path: 'users', component: UserManagementComponent, canActivate: [authGuard] },
  { path: 'groups', component: GroupManagementComponent, canActivate: [authGuard] },
  { path: 'group', component: GroupComponent, canActivate: [authGuard] }
];
