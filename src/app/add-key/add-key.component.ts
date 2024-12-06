import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-key',
  standalone: true,
  imports: [],
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.css']
})
export class AddKeyComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  generateCard(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cardType = (document.getElementById('cardType') as HTMLSelectElement).value;
      const cardPrefix = (document.getElementById('cardPrefix') as HTMLInputElement).value;
      const cardSrefix = (document.getElementById('cardSuffix') as HTMLInputElement).value;
      
      console.log(`卡號類型：${cardType}, 前輟：${cardPrefix}, 尾款：${cardSrefix}`);
    }
  }
  
  exportCard(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('導出卡號');
    }
  }
}
