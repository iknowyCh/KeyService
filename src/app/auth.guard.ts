import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MemberService } from './services/member.service'; // 引入服務來檢查狀態

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private memberService: MemberService) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('role');  // 從 localStorage 檢查角色（登入狀態）

    if (!isLoggedIn) {
      alert('請先登入！');  // 未登入則彈出提示框
      this.router.navigate(['/login']);  // 導向登入頁面
      return false;  // 阻止進入頁面
    }

    return true;  // 已登入則允許進入頁面
  }
}
