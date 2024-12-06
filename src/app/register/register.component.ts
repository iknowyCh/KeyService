import { Component } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 引入 FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = ''; //用來確認密碼
  errorMessage: string = ''; //用來儲存錯誤訊息
  passwordMismatch: boolean = false;
  passwordMismatchCount: number = 0;  //密碼不符計數
  duplicateUsernameCount: number = 0; //重複使用者名稱計數


  constructor(private memberService: MemberService, private router: Router){}

  checkPasswordMatch(): void {
    this.passwordMismatch = this.password !== this.confirmPassword;
  }

  //表單提交邏輯
  onSubmit(): void {
    // 檢查密碼和確認密碼是否相同
    if (this.password !== this.confirmPassword) {
      this.passwordMismatchCount++; //增加密碼不符的嘗試次數
      this.errorMessage = '密碼不相符，請重新輸入';
      alert(this.errorMessage); // 顯示提示框

      if(this.passwordMismatchCount >= 3){
        alert('多次輸入錯誤，將返回首頁');
        this.router.navigate(['/']); //導向首頁
      }
      return;
    }

    //註冊請求
    const user = {
      username: this.username,
      password: this.password,
      plan: 0, // 預設為 0, 可根據需求設定
      times: null,
      creator: 'ss012932',
      locked: 0, //0為已開通
    };

    this.memberService.register(user).subscribe({
      next: (response) => {
        //註冊成功後導航到登入頁面
        alert('註冊成功，請登入！');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // 獲取後端返回的錯誤訊息
        if (error.status === 409) { // 狀態碼 409 表示衝突
          this.duplicateUsernameCount++;
          alert('該用戶名稱已被註冊，請嘗試其他名稱'); // 顯示第一個提示框
      
          if (this.duplicateUsernameCount >= 3) {
            // 如果嘗試次數超過限制，顯示第二個提示框並返回首頁
            setTimeout(() => { // 使用 setTimeout 確保順序執行
              alert('多次嘗試重複名稱，將返回首頁');
              this.router.navigate(['/']); // 導向首頁
            }, 100); // 短暫延遲，確保按下第一個提示框後執行
          }
        } else {
          this.errorMessage = error.error?.message || '註冊失敗，請稍後再試。';
          alert(this.errorMessage); // 顯示其他錯誤提示框
        }
      },
      
    });
  }
}
