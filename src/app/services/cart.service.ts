import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // SUBJECT JE PODKLASA OBSERVABLE KLASE GDE MOGU DA KORISTIM SUBJECT DA OBJAVI "DOGADJAJE", I TI "DOGADJAJI" CE BITI PRIMLJENI KOD SVIH SUBSCRIBER-A, PRI CEMU SUBSCRIBER-I PRIMAJU NOVE 'DOGADJAJE' NAKON STO SE SUBSCRIBE-UJU

  // PRI CEMU POSTOJE 2 PODKLASE SUBJECT KLASE, REPLAYSUBJECT OMOGUCAVA DA SUBSCRIBER-I PRIME SVE DOGADJAJE KOJI SU SE DESILI (CAK I ONE KOJI SU BILI PRE NEGO STO SU SE OVI SUBSCRIBE-OVALI), I BEHAVIOURSUBJECT KOJI OMOGUCAVA DA SUBSCRIBER-I PRIME POSLEDNJI DOGADJAJ KOJI SE DESIO PRE NEGO STO SU SE ONI SUBSCRIBE-OVALI
  totalPrice: Subject<number> = new BehaviorSubject<number>(0); // 0 JE POCETNA VREDNOST ZA ATRIBUT

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {

  }

  addToCart(cartItem: CartItem){
    let alreadyExistsInCart: boolean = false;
    // MORAO SAM DA DODAM '!' KOD UNDEFINED-A DA NAZNACIM DA NECE BITI NULL
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length > 0){
      for(let tempItem of this.cartItems){
        if(tempItem.id == cartItem.id){
          existingCartItem = tempItem;
          break;
        }
      }

      // KORISTIM find() METODU KOJA JE MOGUCA ZA SVE NIZOVE KOJA PROLAZI KROZ SVE ELEMENTE I ISPITUJE ODREDJENI USLOV, SAMA METODA VRACA PRVI ELEMENT KOJI ISPUNJAVA ODREDJENI USLOV ILI INACE VRACA undefined
      
      // existingCartItem = this.cartItems.find(tempItem => tempItem.id == cartItem.id)!;

      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }


  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let cartItem of this.cartItems){
      totalPriceValue = totalPriceValue + (cartItem.quantity * cartItem.unitPrice);

      totalQuantityValue = totalQuantityValue + cartItem.quantity;
    }

    // OVIM CE DA SE OBJAVE VREDNOSTI ZA UKUPNU CENU I ZA UKUPAN BROJ PROIZVODA I SVI SUBSCRIBER-I CE DA PRIHVATE TE VREDNOSTI
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for(let item of this.cartItems){
      const subTotalPrice = item.quantity * item.unitPrice;
      console.log(`name: ${item.name}, quantity: ${item.quantity}, unitPrice: ${item.unitPrice}, subTotalPrice: ${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log(`-----------`);
  }

  decrementQuantity(cartItem: CartItem){
    cartItem.quantity--;

    if(cartItem.quantity == 0){
      this.remove(cartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    // VRACA INDEKS PRVOG PODUDARANJA SA ODREDJENIM USLOVOM, AKO SE NIJEDAN NE PODUDARA ONDA VRACA -1
    const index = this.cartItems.findIndex(tmpItem => tmpItem.id == cartItem.id);

    if(index > -1){
      // OVOM METODOM BRISEM ELEMENT IZ NIZA NA ODREDJENOM INDEKSU, PRI CEMU SAM NAZNACIO DA BRISEM SAMO JEDAN ELEMENT IZ NIZA
      this.cartItems.splice(index, 1);

      this.computeCartTotals();
    }
  }
}
