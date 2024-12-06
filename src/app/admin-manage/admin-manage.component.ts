import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination'; // 分頁模組
import { RouterModule, Router } from '@angular/router';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css'
})
export class AdminManageComponent implements OnInit {
  admins: any[] = []; // 全部的管理員資料
  filteredAdmins: any[] = []; // 搜尋後的管理員資料
  searchTerm: string = ''; // 搜尋字串
  p: number = 1; // 當前頁碼，預設為第一頁
  itemPerPage: number = 10; // 每頁顯示的管理員數量
  admin: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.memberService.checkSession().subscribe({
      next: (response) => {
        if (response.success) {
          this.getAdmins(); // 確保只有已登入時執行此邏輯
        } else {
          this.router.navigate(['/login']); // 未登入時導向登入頁
        }
      },
      error: (error) => console.warn('檢查 Session 發生錯誤', error)
    });
  }
  

  // 強制刷新當前使用者資料
  refreshCurrentUser(): void {
    this.memberService.loadCurrentUser(); // 從後端載入當前使用者
    this.memberService.currentUser$.subscribe(username => {
      if (username) {
        this.admin.creator = username; // 設置 `admin` 的 `creator` 屬性
      } else {
        console.warn('無法設置 `admin.creator`，因為 `username` 為空或未定義');
      }
    });
  }
  

  // 從後端獲取管理員資料
  getAdmins(): void {
    this.http.get<any[]>('https://localhost:7142/api/Users/admins', { withCredentials: true }).subscribe({
      next: (data) => {
        this.admins = data;
        this.filteredAdmins = [...this.admins]; // 初始化搜尋結果為所有管理員
      },
      error: (err) => console.error('無法取得管理員資料', err)
    });
  }

  // 搜尋管理員
  searchAdmins(): void {
    const searchValue = this.searchTerm.toLowerCase();
    // 篩選管理員名稱中包含搜尋字串的資料
    this.filteredAdmins = this.admins.filter(admin =>
      admin.username.toLowerCase().includes(searchValue)
    );
  }

  // 當頁碼變更時觸發
  onPageChange(newPage: number): void {
    this.p = newPage; // 更新當前頁碼
  }

  // 編輯管理員
  editAdmin(username: string): void {
    this.router.navigate(['/admin/edit-admin', username]); // 導航至編輯頁面
  }

  // 刪除管理員
  deleteAdmin(id: number): void {
    if (confirm(`確定要刪除嗎？`)) {
      this.http.delete(`https://localhost:7142/api/Users/admins/${id}`, { withCredentials: true }).subscribe({
        next: () => {
          console.log(`管理員已成功刪除`);

          // 刪除成功後重新獲取管理員資料
          this.getAdmins();

          // 等待資料刷新後檢查頁碼是否需要變更
          setTimeout(() => {
            const totalItems = this.filteredAdmins.length; // 取得刪除後的總項目數量
            const maxPages = Math.ceil(totalItems / this.itemPerPage); // 計算目前總頁數

            if (totalItems === 0 && this.p > 1) {
              // 當前頁碼大於 1 且當前頁已無資料時跳回上一頁
              this.p--;
            } else if (this.p > maxPages) {
              // 若刪除後頁碼超過最大頁碼，也跳回上一頁
              this.p = maxPages;
            }

            console.log('頁碼變更為：', this.p);
          }, 200); // 200ms 等待資料刷新後進行頁碼變更檢查

          alert(`管理員已被刪除`); // 顯示刪除成功訊息
        },
        error: (err) => {
          console.error('無法刪除管理員', err);
          alert('無法刪除該管理員，請稍後再試。');
        }
      });
    }
  }
}
