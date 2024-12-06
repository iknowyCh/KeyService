import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 確保導入 FormsModule
import { CommonModule } from '@angular/common'; // 確認已導入
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AddAdminComponent implements OnInit {
  admin = {
    username: '',
    password: '',
    role: 0,
    creator: '', // 用於顯示當前登入的管理員名稱
    coins: 0,
    sell: 0,
    days: 0,
    weeks: 0,
    months: 0
  };

  constructor(private http: HttpClient, private router: Router, private memberService: MemberService) {}

  ngOnInit(): void {
    this.loadCurrentUser(); // 初始化時加載當前使用者
  }

  // 加載當前使用者並設置為 creator
  private loadCurrentUser(): void {
    this.memberService.getCurrentUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.admin.creator = response.username; // 設置 creator 為當前登入用戶名稱
        }
      },
      error: (error) => {
        console.error('無法加載當前使用者', error);
      }
    });
  }

  // 提交表單，新增管理員
  submitAdmin(form: NgForm) {
    if (!this.admin.username || !this.admin.password) {
      alert('請填寫使用者名稱和密碼');
      return;
    }
    
    if (form.valid) {
      this.http.post('https://localhost:7142/api/Users/admin', this.admin, { withCredentials: true }).subscribe({
        next: () => {
          alert('管理員已成功新增！');
          this.router.navigate(['/admin/admin-manage']); // 新增成功後跳轉
        },
        error: (error) => {
          console.error('新增管理員失敗', error);
          alert('新增失敗，請稍後再試。');
        }
      });
    }
  }

  // 儲值金額、天卡售價、週卡售價、月卡售價限制
  onCoinsInput(event: any) {
    if (event.target.value < 0) this.admin.coins = 0;
  }
  onDaysInput(event: any) {
    if (event.target.value < 0) this.admin.days = 0;
  }
  onWeeksInput(event: any) {
    if (event.target.value < 0) this.admin.weeks = 0;
  }
  onMonthsInput(event: any) {
    if (event.target.value < 0) this.admin.months = 0;
  }
}
