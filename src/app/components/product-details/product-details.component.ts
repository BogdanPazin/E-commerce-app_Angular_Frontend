import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  
  // DODAJE SE '!' DA BI NAZNACIO TYPESCRIPT-U DA SE NE DODELJUJE NULL
  product!: Product;
  
  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute){

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => {
        this.handleProductDetails();
      }
    )
  }

  handleProductDetails() {
    // UZIMAM ID IZ PUTANJE, PRI CEMU MORA DA BUDE ISTI NAZIV OVDE I U SAMOJ PUTANJI KOJU SAM NAPRAVIO
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(productId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToCart(){
    console.log(`Adding to cart: ${this.product.name}, price: ${this.product.unitPrice}`);

    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
