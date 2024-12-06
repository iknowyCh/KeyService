import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient } from '@angular/common/http'; // 引入 provideHttpClient
import { provideRouter, Route } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { ForgotComponent } from './app/forgot/forgot.component';
import { ShopstoreComponent } from './app/shopstore/shopstore.component';
import { AdminDashboardComponent } from './app/admin-dashboard/admin-dashboard.component';
import { AdminMainpageComponent } from './app/admin-mainpage/admin-mainpage.component';
import { UserManageComponent } from './app/user-manage/user-manage.component';
import { AddUserComponent } from './app/add-user/add-user.component';
import { OrderManageComponent } from './app/order-manage/order-manage.component';
import { ProductManageComponent } from './app/product-manage/product-manage.component';
import { AddProductComponent } from './app/add-product/add-product.component';
import { AddKeyComponent } from './app/add-key/add-key.component';
import { EditUserComponent } from './app/edit-user/edit-user.component';
import { KeyManageComponent } from './app/key-manage/key-manage.component';
import { AdminManageComponent } from './app/admin-manage/admin-manage.component';
import { AddAdminComponent } from './app/add-admin/add-admin.component';
import { EditAdminComponent } from './app/edit-admin/edit-admin.component';

const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'login', component:LoginComponent },
  { path: 'register', component:RegisterComponent },
  { path: 'shop', component:ShopstoreComponent }, 
  { path: 'forgot', component:ForgotComponent},
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: 'mainpage', component:AdminMainpageComponent},
      { path: 'user-manage', component: UserManageComponent },
      { path: 'admin-manage', component: AdminManageComponent},
      { path: 'edit-admin', component: EditAdminComponent},
      { path: 'add-user', component:AddUserComponent},
      { path: 'edit-user/:username', component: EditUserComponent },
      { path: 'admin/edit-admin/:username', component: EditAdminComponent },
      { path: 'add-admin', component: AddAdminComponent },
      { path: 'order-manage', component:OrderManageComponent},
      { path: 'product-manage',component:ProductManageComponent},
      { path: 'add-product', component:AddProductComponent},
      { path: 'key-manage', component:KeyManageComponent},
      { path: 'add-key', component:AddKeyComponent},
      { path: '**', redirectTo: 'admin/user-manage' },
      {
        path: 'admin/admin-manage',
        component: AdminManageComponent, // 確保這裡對應到正確的 Component
      },
      
    ]
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // 確保提供 HttpClient
  ]
}).catch(err => console.error(err));
