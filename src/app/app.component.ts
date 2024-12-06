import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 確認導入 RouterModule
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ShopstoreComponent } from './shopstore/shopstore.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminMainpageComponent } from './admin-mainpage/admin-mainpage.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { AddUserComponent } from './add-user/add-user.component';
import { OrderManageComponent } from './order-manage/order-manage.component';
import { ProductManageComponent } from './product-manage/product-manage.component';
import { AddProductComponent } from './add-product/add-product.component';
import { KeyManageComponent } from './key-manage/key-manage.component';
import { AddKeyComponent } from './add-key/add-key.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AdminManageComponent } from './admin-manage/admin-manage.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';

@Component({
  selector: 'app-root', // 根組件的選擇器，用來標識這個組件
  standalone: true, // 標識這個組件是獨立的
  imports: [
    RouterModule,
    HomeComponent, // 匯入首頁元件
    LoginComponent, // 匯入登入頁面元件
    RegisterComponent,
    ForgotComponent,
    ShopstoreComponent,
    AdminDashboardComponent, // 匯入後台管理頁面元件
    AdminMainpageComponent,
    UserManageComponent,
    AddUserComponent,
    OrderManageComponent,
    ProductManageComponent,
    AddProductComponent,
    KeyManageComponent,
    AddKeyComponent,
    EditUserComponent,
    AdminManageComponent,
    AddAdminComponent,
    EditAdminComponent
  ],
  templateUrl: './app.component.html', // 指定組件的 HTML 模板
  styleUrls: ['./app.component.css'], // 指定組件的 CSS 樣式

})
export class AppComponent {
  title = 'keyservice'; // 組件的屬性，存放應用程式的標題
}
