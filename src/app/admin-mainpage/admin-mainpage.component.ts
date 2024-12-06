import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common'; // 確保已經導入

@Component({
  selector: 'app-admin-mainpage',
  templateUrl: './admin-mainpage.component.html',
  styleUrls: ['./admin-mainpage.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminMainpageComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

   // 定義 newOrders 屬性
   newOrders = [
    { productName: '商品A', quantity: 5 },
    { productName: '商品B', quantity: 3 },
    { productName: '商品C', quantity: 2 }
  ];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initUserChart();
      this.initTopProductChart();
    }
  }

  initUserChart() {
    const userChartCtx = document.getElementById('userChart') as HTMLCanvasElement;
    // Chart.js 初始化代碼
  }

  initTopProductChart() {
    const topProductChartCtx = document.getElementById('topProductChart') as HTMLCanvasElement;
    // Chart.js 初始化代碼
  }
}
