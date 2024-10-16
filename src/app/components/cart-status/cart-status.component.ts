import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService){

  }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    
    // SUBSCRIBE-UJEM ATRIBUTE IZ OVE KOMPONENTE SA ONOM VREDNOSCU KOJA SE DOBIJA IZ CART SERVICE-A, TAKO DA CE OVDE DA SE PRIME TE VREDNOSTI IZ SERVICE-A
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }
}
