import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MemberService } from '../services/member.service'; // 引入服務
import { FormsModule } from '@angular/forms'; // 匯入 FormsModule]
import { HttpClientModule } from '@angular/common/http';
import { response } from 'express';


@Component({
  selector: 'app-login',
  standalone: true,  // 加入 standalone 屬性
  imports: [FormsModule,HttpClientModule], // 加入 FormsModule 以使用 ngModel
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  loginAttempts: number = 0;

  constructor(private http: HttpClient,private memberService: MemberService, private router: Router) {}

// 處理登入邏輯
login() {
  this.memberService.login(this.username, this.password).subscribe({
    next: (response) => {
      if (response.success) {
        console.log('登入成功');

        // 保存角色到 localStorage
        localStorage.setItem('role', response.role);

        // 根據不同角色進行導航
        if (response.role === 'admin') {
          this.router.navigate(['/admin']);  // 管理員重定向到後台
        } else if (response.role === 'user') {
          this.router.navigate(['/']);  // 一般用戶重定向到首頁
        }
      } else {
        console.log('登入失敗', response.message);
      }
    },
    error: (error) => {
      console.log('登入失敗', error);
      this.loginAttempts++;

      if (this.loginAttempts >= 3) {
        console.log('多次登入失敗，將導回首頁');
        this.router.navigate(['/']);
      }
    }
  });
}

logout() {
  this.memberService.logout().subscribe({
    next: (response) => {
      if (response.success) {
        console.log('登出成功');
        localStorage.removeItem('role');  // 清除儲存的角色
        sessionStorage.clear();  // 強制清除所有 session 資料
        this.router.navigate(['/login']);  // 導向到登入頁面
      }
    },
    error: (error) => {
      console.log('登出失敗', error);
    },
    complete: () => {
      this.router.navigate(['/login']);  // 確保導向登入頁面
    }
  });
}

}