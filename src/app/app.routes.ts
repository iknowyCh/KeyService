import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ShopstoreComponent } from './shopstore/shopstore.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { AddUserComponent } from './add-user/add-user.component'; // 確保引入 AddUserComponent

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'shopstore', component: ShopstoreComponent },
  {
    path: 'admin', 
    component: AdminDashboardComponent, 
    children: [
      { path: 'user-manage', component: UserManageComponent },
      { path: 'add-user', component: AddUserComponent },
    ]
  }
];

