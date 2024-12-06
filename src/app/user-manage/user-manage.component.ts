import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MemberService, User } from '../services/member.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
  
  users: User[] = []; // 所有用戶資料
  filteredUsers: User[] = []; // 篩選後的用戶資料
  p: number = 1; // 當前頁碼，預設為第一頁
  itemPerPage: number = 10; // 每頁顯示的用戶數量
  searchTerm: string = ''; // 搜尋關鍵字
  statusFilter: string = 'all'; // 狀態篩選
  noData: boolean = false; // 無資料標誌

  constructor(
    private memberService: MemberService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUsersByCreator(); // 初始化時獲取用戶資料
  }

  // 獲取用戶資料
  getUsersByCreator(): void {
    this.memberService.getUsersByCreator().subscribe({
      next: (response: User[]) => {
        console.log('原始 API 回傳資料:', response);

        this.users = response.map((user: any) => ({
          ...user,
          date: user.date ? new Date(user.date).toISOString().split('T')[0] : null,
          times: typeof user.times === 'number' ? user.times : 0
        }));

        this.filteredUsers = [...this.users];
        this.noData = this.users.length === 0;

        this.cdr.detectChanges(); // 手動觸發變更檢測
        console.log('處理後的用戶資料:', this.users);
      },
      error: (err: any) => {
        console.error('獲取用戶資料失敗', err);
        this.noData = true;
      }
    });
  }

  // 搜尋與篩選用戶
  searchUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && user.locked === 0) ||
        (this.statusFilter === 'inactive' && user.locked === 1) ||
        (this.statusFilter === 'fix' && user.locked === 2);

      return matchesSearch && matchesStatus;
    });
  }

    // 當頁碼變更時觸發
    onPageChange(newPage: number): void {
      this.p = newPage; // 更新當前頁碼
    }
  

  // 編輯用戶
  editUser(username: string): void {
    this.router.navigate(['/admin/edit-user', username]);
  }

  // 刪除用戶
  deleteUser(username: string): void {
  if (confirm('確定要刪除這個用戶嗎？')) {
    this.memberService.deleteUser(username).subscribe({
      next: (response) => {
        console.log('刪除成功', response);
        this.getUsersByCreator(); // 刷新用戶列表

        setTimeout(() => {
          const totalItems = this.filteredUsers.length; // 刪除後的總用戶數
          const maxPages = Math.ceil(totalItems / this.itemPerPage); // 計算總頁數


          if (totalItems === 0 && this.p > 1) {
            // 如果當前頁碼大於 1 且當前頁已無資料，跳回上一頁
            this.p--;
          } else if (this.p > maxPages) {
            // 若刪除後頁碼超過最大頁碼，也跳回上一頁
            this.p = maxPages;
          }

          console.log('頁碼變更為：', this.p);
        }, 200); // 200ms 等待資料刷新後進行頁碼變更檢查

        alert(`用戶已成功刪除`); // 顯示提示框
      },
      error: (err) => {
        console.error('無法刪除用戶', err);
        alert('無法刪除該用戶，請稍後再試。');
      }
    });
  }
}
        }
