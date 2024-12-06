import { Component, AfterViewInit, ElementRef, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MemberService } from '../services/member.service'; // 導入 MemberService
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopstore',
  standalone: true,
  imports: [],
  templateUrl: './shopstore.component.html',
  styleUrls: ['./shopstore.component.css']
})
export class ShopstoreComponent implements AfterViewInit {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private memberService: MemberService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initTooltips();
    }
  }

  initTooltips(): void {
    const tooltip = this.renderer.createElement('div');
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.appendChild(document.body, tooltip);
    }
  }

  ngOnInit(): void {
    // 檢查用戶是否已登入
    this.memberService.checkSession().subscribe({
      next: (response) => {
        if (!response.success) {
          // 如果沒有登入，顯示提示並導向登入頁面
          alert('請先登入');
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('檢查 Session 發生錯誤', error);
      }
    });
  }
}
