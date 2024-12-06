import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms'; // 匯入 FormsModule
import { CommonModule } from '@angular/common'; // 匯入 CommonModule

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css'],
  standalone: true, // 設為 Standalone 元件
  imports: [FormsModule, CommonModule], // 匯入必要的模組
})
export class EditAdminComponent implements OnInit {
  admin: any = {
    username: '',
    password: '',
    role: 1, // 預設為經銷商
    locked: 0, // 預設為啟用
    coins: 0,
    sell: '',
    days: 0,
    weeks: 0,
    months: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.getAdminData(username);
    } else {
      alert('無法取得管理員資料');
      this.router.navigate(['/admin/admin-manage']);
    }
  }

  // 獲取管理員資料
  getAdminData(username: string): void {
    this.http.get<any>(`https://localhost:7142/api/Users/admins/${username}`).subscribe({
      next: (data) => {
        this.admin = data;
      },
      error: (err) => {
        console.error('無法取得管理員資料:', err);
        alert('取得資料失敗，返回管理員頁面');
        this.router.navigate(['/admin/admin-manage']);
      },
    });
  }

  // 提交編輯管理員資料
  submitEditAdmin(form: NgForm): void {
    console.log('提交的管理員資料：', this.admin);

    this.http.put(`https://localhost:7142/api/Users/admins/${this.admin.username}`, this.admin).subscribe({
      next: () => {
        alert('管理員資料更新成功');
        form.resetForm(this.admin); // 重置表單
        this.router.navigate(['/admin/admin-manage']);
      },
      error: (err) => {
        console.error('無法更新管理員資料:', err);
        alert('更新失敗');
      },
    });
  }
}
