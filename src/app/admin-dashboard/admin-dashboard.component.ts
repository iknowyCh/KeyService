import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // 確保匯入 RouterModule 和 Router
import { CommonModule } from '@angular/common'; // 匯入 CommonModule
import { MemberService } from '../services/member.service'; // 假設這是會員服務

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule], // 必要的模組匯入
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  username: string = ''; // 用來存儲當前使用者名稱
  isHovered: boolean = false; // 用於控制導覽列的 hover 狀態

  constructor(
    private router: Router,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.getUserName(); // 初始化時獲取使用者名稱
  }

  // 導航至首頁
  navigateToHome(): void {
    this.router.navigate(['/']); // 手動導航到首頁
  }

  // 獲取當前使用者名稱
  getUserName(): void {
    this.memberService.getCurrentUser().subscribe({
      next: (response) => {
        this.username = response.username; // 儲存 API 返回的使用者名稱
        console.log('取得的使用者名稱:', this.username);
      },
      error: (err) => {
        console.error('無法獲取使用者名稱', err);
      }
    });
  }

    // 登出功能
    // admin-dashboard.component.ts
  logout(): void {
    this.memberService.logout().subscribe({
      next: () => {
        console.log('登出成功');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('後台登出失敗', error);
      }
    });
  }
}
