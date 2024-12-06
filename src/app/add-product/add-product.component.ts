import { Component } from '@angular/core';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

  //定義表單資料屬性(根據在表單中的欄位)
  productName: string = '';
  productCategory: string = '';
  productSpecs: string = '';
  productPrice: number = 0;
  productStock: number = 0;

  //新增 addProduct 方法
  addProduct(){
    //簡單的表單驗證(可以根據需求添加更多驗證邏輯)
    if(!this.productName || !this.productCategory || this.productPrice <=0 || this.productStock < 0){
      alert('請填寫所有欄位且確保價格和庫存正確！');
      return;
    }

    //將輸入商品資料顯示在控制台(可在這裡替換為實際的提交邏輯)
    console.log({
      productName: this.productName,
      productCategory: this.productCategory,
      productSpecs: this.productSpecs,
      productPrice: this.productPrice,
      productStock: this.productStock,
    });
    alert('商品已成功加入！')
  }
}
