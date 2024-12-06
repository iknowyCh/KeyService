import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  isHovered: boolean = false;

  constructor(private memberService: MemberService, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus(); // 初始化時檢查登入狀態
  }

  checkLoginStatus(): void {
    this.memberService.checkSession().subscribe({
      next: (response) => {
        if (response.success) {
          this.isLoggedIn = true; // 如果 session 有效，設定 isLoggedIn 為 true
        } else {
          this.isLoggedIn = false; // 如果 session 無效，設定為 false
        }
      },
      error: (error) => {
        this.isLoggedIn = false; // 確保在錯誤發生時也能處理
        console.error('檢查 Session 發生錯誤', error);
      }
    });
  }
  

  // 未登入時顯示提示框
  showLoginAlert(): void {
    alert('請先登入');
  }

  // 導航到選購頁面
  goToShop(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/shop']); // 如果已登入，導航到 /shop
    } else {
      this.showLoginAlert(); // 如果未登入，顯示提示框
    }
  }

  // 登出邏輯
    // 登出邏輯
    logout(): void {
      this.memberService.logout().subscribe({
        next: () => {
          this.isLoggedIn = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('登出失敗', error);
        }
      });
    }
}
