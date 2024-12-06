import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopstoreComponent } from './shopstore.component';

describe('ShopstoreComponent', () => {
  let component: ShopstoreComponent;
  let fixture: ComponentFixture<ShopstoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopstoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
