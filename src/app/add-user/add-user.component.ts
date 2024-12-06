import { Component, OnInit } from '@angular/core';
import { MemberService, User } from '../services/member.service'; 
import { NgForm, FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  username = ''; 
  password = ''; 
  plan = '1'; 
  Times: number = 0; 
  duration: number = 0; 
  creator = 'admin'; 
  user: any;

  constructor(
    private memberService: MemberService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.memberService.getCurrentUser().subscribe({
      next: (response) => {
        this.creator = response.username; 
      },
      error: (err) => {
        console.error('無法獲取當前登入使用者名稱', err);
      }
    });
  }

  onPlanChange(event: Event): void {
    const selectedPlan = (event.target as HTMLSelectElement).value;
    this.plan = selectedPlan;

    if (this.plan === '1') {
      this.Times = 0;
      this.duration = 0;
    } else if (this.plan === '2') {
      this.duration = 0;
      this.Times = 0;
    }
  }

   // 驗證次數是否為非負整數
 isValidTimes(): boolean {
  return Number.isInteger(this.user?.times ?? 0) && (this.user?.times ?? 0) >= 0;
}

  onTimesInput(event: any): void {
    const inputValue = Number(event.target.value);
    if (inputValue < 0) {
      this.Times = 0;
    }
  }

  onDateInput(event: any): void {
    const inputValue = Number(event.target.value);
    if (inputValue < 0) {
      this.duration = 1;
    }
  }

  calculateExpiryDate(days: number): string {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0];
  }

  submitMember(form: NgForm): void {
    if (form.invalid) {
      alert('表單填寫不完整');
      return;
    }

    let newUser: User = {
      username: this.username,
      password: this.password,
      plan: Number(this.plan),
      times: Number(this.Times),
      locked: 0,
      creator: this.creator,
    };

    if (this.plan === '2') {
      newUser.date = this.calculateExpiryDate(this.duration);
    } else {
      newUser.date = null;
    }

    console.log('即將傳送的用戶資料:', newUser);

    this.memberService.addMember(newUser).subscribe({
      next: (response) => {
        console.log('會員新增成功', response);
        this.router.navigate(['/admin/user-manage']);
      },
      error: (error) => {
        console.error('會員新增失敗', error);
        alert('會員新增失敗，請檢查輸入資料');
      }
    });
  }
}
