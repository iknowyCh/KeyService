import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService, User } from '../services/member.service';
import { NgForm, FormsModule } from '@angular/forms'; // 匯入 FormsModule
import { CommonModule } from '@angular/common'; // 匯入 CommonModule

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  standalone: true, // 使用 Standalone 元件
  imports: [FormsModule, CommonModule], // 匯入必要的模組
})
export class EditUserComponent implements OnInit {
  user: User = { 
    username: '', 
    password: '', 
    plan: 1,  // 預設為次數用戶
    times: 0, 
    date: '',
    locked:0,
  };

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.getUserData(username); // 獲取用戶資料
    } else {
      alert('無法取得用戶名稱，返回用戶管理頁面');
      this.router.navigate(['/admin/user-manage']);
    }
  }

  // 獲取用戶資料
  getUserData(username: string): void {
    this.memberService.getUserByUsername(username).subscribe({
      next: (response: User) => {
        this.user = response;
        console.log('取得的用戶資料:', this.user);
      },
      error: (error) => {
        console.error('取得用戶資料失敗:', error);
        alert('無法取得用戶資料，返回用戶管理頁面');
        this.router.navigate(['/admin/user-manage']);
      }
    });
  }

  // 當方案切換時處理
  onPlanChange(): void {
    if (this.user.plan === 1) {
      this.user.date = ''; // 若選擇次數用戶，清除日期
    } else if (this.user.plan === 2) {
      this.user.times = 0; // 若選擇時效用戶，清除次數
    }
  }

  // 驗證次數是否為非負整數
  isValidTimes(): boolean {
    return Number.isInteger(this.user?.times ?? 0) && (this.user?.times ?? 0) >= 0;
  }



  // 監控次數輸入框，確保無法輸入負數
  onTimesInput(event: any): void {
    const inputValue = Number(event.target.value);
    if (inputValue < 0) {
      this.user.times = 0; // 若輸入負數，自動設為 0
    }
  }

  onDateInput(event: any): void{
    const inputValue = Number(event.target.value);
    if(inputValue < 0){
      this.user.date = '1'; // 若輸入負數，自動設為 1，最少1天
    }
  }

  // 提交表單並驗證輸入
  submitEditUser(form: NgForm): void {
    console.log('準備提交的用戶資料:', this.user); // 檢查資料結構

    if (this.user.plan === 1) {
      this.user.date = null; // 若為次數用戶，將 date 設為 null
      if (!this.isValidTimes()) {
        alert('次數必須為非負整數');
        return;
      }
    } else if (this.user.plan === 2) {
      const days = Number(this.user.date);
      if (isNaN(days) || days <= 0) {
        alert('請輸入有效的非負整數天數');
        return;
      }
      this.user.date = this.calculateExpiryDate(days); // 計算到期日
    }

    console.log('提交資料：', this.user); // 確認傳遞的資料格式

    this.memberService.updateUser(this.user.username, this.user).subscribe({
      next: () => {
        alert('會員資料更新成功');
        form.resetForm(this.user); // 重置表單
        this.router.navigate(['/admin/user-manage']); // 成功後返回管理頁面
      },
      error: () => {
        alert('更新會員資料失敗');
      }
    });
  }

  // 計算到期日：當天日期 + 給予天數
  calculateExpiryDate(days: number): string {
    const today = new Date();
    today.setDate(today.getDate() + days); // 加上天數
    return today.toISOString().split('T')[0]; // 格式化為 'YYYY-MM-DD'
  }
}
