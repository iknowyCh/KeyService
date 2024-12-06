import { Component, OnInit } from "@angular/core";
import { MemberService } from '../services/member.service';
import { HttpClient } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router'; // 確保匯入 RouterModule
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-key-manage',
  standalone: true,
  imports: [RouterModule,CommonModule,NgxPaginationModule,FormsModule], // 在這裡匯入 RouterModule
  templateUrl: './key-manage.component.html',
  styleUrls: ['./key-manage.component.css']
})

export class KeyManageComponent implements OnInit{
  keys: any[] = []; // 存放後端返回的卡號資料
  p: number = 1; // 當前頁碼，預設為第一頁
  itemPerPage: number = 10; // 每頁顯示的用戶數量
  filteredKeys: any[] = []; // 篩選後的卡號資料
  searchTerm: string = ''; // 搜尋關鍵字
  
  
  constructor(
    private http: HttpClient,
    private memberService: MemberService,
    private router: Router, 
   ){}
     
   
   ngOnInit(): void {
    this.getKey(); // 初始化時獲取資料
  }

  // 獲取 key 資料表的資料
  getKey(): void{
    console.log('開始發送請求到 Key API');
    this.http.get<any[]>('https://localhost:7142/api/Users/key', { withCredentials: true }).subscribe({
      next: (data) => {
        this.keys = data; // 儲存取得的資料
        this.filteredKeys = [...this.keys]; // 初始時將所有資料設為篩選結果
      },
      error: (err) =>{
        console.error('無法獲取卡號', err);
      }
    });
  }

  //搜尋卡號
  searchKeys(): void{
    const searchValue = this.searchTerm.toLowerCase(); //將搜尋字串轉為小寫
    this.filteredKeys = this.keys.filter(key =>
    (key.keyValue && key.keyValue.toLowerCase().includes(searchValue)) || // 卡號名稱搜尋
    (key.creator && key.creator.toLowerCase().includes(searchValue))|| // 創建者搜尋
    (key.reseller && key.reseller.toLowerCase().includes(searchValue)) // 銷售員搜尋
    );
  }

  // 當頁碼變更時觸發
  onPageChange(newPage: number): void {
  this.p = newPage; // 更新當前頁碼
  console.log('頁碼已變更：', this.p);
  }

  cardTypes: { [key:number]: string } = {
    0:'時效卡',
    1:'次數卡',
    2:'解綁卡'
  };

  getCardType(type: number): string{
    return this.cardTypes[type] || '未知類型'; // 若找不到對應的值，將會返回'未知類型'
  }

  // 鎖定卡號功能
  lockKey(key: any): void {
    console.log(`正在鎖定卡號ID: ${key.id}`);
    this.http.put(`https://localhost:7142/api/Users/key/${key.id}/lock`, {}, { withCredentials: true }).subscribe({
      next: () => {
        console.log(`卡號 ${key.id} 已鎖定`);
        key.locked = '1'; // 更新前端的狀態為 "1" (是)
        alert(`卡號已成功鎖定`); // 彈出提示框
      },
      error: (err) => {
        console.error('無法鎖定卡號', err);
      }
    });
  }

  // 解除卡號鎖定功能
  unlockKey(key: any): void {
    console.log(`正在解除鎖定卡號ID: ${key.id}`);
    this.http.put(`https://localhost:7142/api/Users/key/${key.id}/unlock`, {}, { withCredentials: true }).subscribe({
      next: () => {
        console.log(`卡號 ${key.id} 已解除鎖定`);
        key.locked = '0'; // 更新前端的狀態為 "0" (否)
        alert(`卡號已成功解除鎖定`); // 彈出提示框
      },
      error: (err) => {
        console.error('無法解除鎖定卡號', err);
      }
    });
  }


  // 刪除卡號功能
deleteKey(id: number): void {
  if (confirm(`你確定要刪除卡號 ${id} 嗎？`)) {
    this.http.delete(`https://localhost:7142/api/Users/key/${id}`, { withCredentials: true }).subscribe({
      next: () => {
        console.log(`卡號 ${id} 已成功刪除`);

        // 刪除成功後重新獲取資料
        this.getKey();

        // 使用 setTimeout 等待資料刷新後進行檢查
        setTimeout(() => {
          const totalItems = this.filteredKeys.length; // 取得刪除後的總項目數量
          const maxPages = Math.ceil(totalItems / this.itemPerPage); // 計算目前總頁數

          if (totalItems === 0 && this.p > 1) {
            // 如果當前頁碼大於 1 且當前頁已無資料，跳回上一頁
            this.p--;
          } else if (this.p > maxPages) {
            // 若刪除後頁碼超過最大頁碼，也跳回上一頁
            this.p = maxPages;
          }

          console.log('頁碼變更為：', this.p);
        }, 200); // 200ms 等待資料刷新後進行頁碼變更檢查

        alert(`卡號已成功刪除`); // 顯示提示框
      },
      error: (err) => {
        console.error('無法刪除卡號', err);
        alert('無法刪除該卡號，請稍後再試。');
      }
    });
  }
}




}