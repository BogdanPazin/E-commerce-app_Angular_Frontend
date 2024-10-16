import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  
  // FORM GROUP JE KOLEKCIJA KONTROLA FORME OD ELEMENATA FORME ILI KOLEKCIJA DRUGIH GRUPA
  checkoutFormGroup: FormGroup = undefined!;

  // RADIO SAM ISTO SA OVOM KOMPONENTOM I CART SERVICE-OM KAO STO JE RADJENO SA CART STATUS KOMPONENTOM I CART SERVICE-OM VEZANO ZA UKUPNU CENU I KOLICINU
  // ALI POSTO JE OVA KOMPONENTA NAPRAVLJENA POSLE CART STATUS KOMPONENTE ONA NECE DA PRIMI PRETHODNE VREDNOSTI AKO SU UKUPNA CENA I KOLICINA U CART SERVICE-U STAVLJENE KAO OBICAN SUBJECT OBJEKAT, VEC MOZE DA SE PROMENI TIP TOG SUBJECT-A NA BEHAVIOR I REPLAY
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  // SA FORM BUILDER-OM CU ZAPRAVO DA PRAVIM FORMU
  constructor(private formBuilder: FormBuilder, 
    private formService: FormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router){

  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      // OVO MI JE PRVA GRUPA SA KLJUCEM customer
      customer : this.formBuilder.group({
        // SA FormControl SE POSTAVLJA VALIDACIJA ZA POLJA
        firstName: new FormControl('', [Validators.required, 
          Validators.minLength(2), 
          ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required,
           Validators.minLength(2), 
           ShopValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, 
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        )
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required,
          Validators.minLength(2), 
          ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
          Validators.minLength(2), 
          ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required,
          Validators.minLength(2), 
          ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
          Validators.minLength(2), 
          ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required,
          Validators.minLength(2), 
          ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', 
          [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', 
          [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // U JAVASCRIPT MESECI IDU 0 ... 11, ZATO MORA +1
    const startMonth: number = new Date().getMonth() + 1;
    console.log(`startMonth: ${startMonth}`);

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months" + JSON.stringify(data));
        this.creditCardMonths = data;
      });


    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));

        this.creditCardYears = data;
      }
    );


    this.formService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

    this.reviewCartDetails();
  }

  onSubmit(){
    console.log(`Handling the submit button`);

    if(this.checkoutFormGroup.invalid){
      // AKO OZNACIM SVA POLJA KAO touched ONDA CE TO DA IZAZOVE ERROR MESSAGE
      this.checkoutFormGroup.markAllAsTouched();
      return; // OVO JE STAVLJENO DA SE NE IZVRSAVA NISTA OD SLEDECEG JER JE PALA VALIDACIJA FORME
    }


    // console.log(this.checkoutFormGroup.get('customer')!.value);
    // console.log("The email is " + this.checkoutFormGroup.get('customer')!.value.email);
    // console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')!.value.country.name);
    // console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress')!.value.state.name);


    /////////////POPUNJAVAM SAMU PORUDZBINU/////////////

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = [];
    for(let i = 0; i < cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    // let orderItems: OrderItem[] = cartItems.map(
    //   tempCartItem => new OrderItem(tempCartItem)
    // );

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe(
      {
        // NAPRAVLJENE SU 2 "PUTANJE", AKO USPE JE NEXT A AKO NE USPE JE ERROR, PRI CEMU CE response DA BUDE ZAPRAVO JSON STRING SA orderNumber
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          // KADA PRODJE NARUDZBINA ONDA SE RESETUJE KORPA
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    )
  }

  copyShippingAddressToBillingAddress(event: Event) {
    if((event.target as HTMLInputElement).checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // FIX ZA STATE DEO ZA Billing Address KADA SE KLIKNE CHECKBOX
      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    // PRISTUPAM GRUPI IZ FORME KOJA JE ZADUZENA ZA KREDITNU KARTICU KAKO BI PRISTUPAO VREDNOSTIMA KOJE SU UNESENE
    const formGroup= this.checkoutFormGroup.get('creditCard');

    let currentYear: number = new Date().getFullYear();
    let enteredYear: number = Number(formGroup!.value.expirationYear);

    let startMonth: number;

    if(currentYear == enteredYear){
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    // NA OSNOVU PODATKA ZA POCETNI MESEC, DOBIJAM OSTALE MESECE ZA DROP DOWN MENU
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));

        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    // POSLACE SE SHIPPING ADDRESS ILI BILLING ADDRESS
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup!.value.country.code;
    const countryName = formGroup!.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.formService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName == 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }

        // HOCU DA AUTOMATSKI IZABERE PRVI STATE KAD SE IZABERE DRZAVA
        formGroup!.get('state')!.setValue(data[0]);
      }
    );
  }

  // OVO SU METODE ZA PRISTUPANJE POTREBNIH USLOVA ZA POLJA FORME, SVA POLJA ZA KOJA SAM STAVIO NEKI REQUIREMENT ONDA MORA DA IMA OVAKVA METODA
  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet(){
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity(){
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressCountry(){
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressState(){
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressZipCode(){
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode(){
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  reviewCartDetails() {
    // SUBSCRIBE-UJEM ATRIBUTE OVE KOMPONENTE SA ONIM IZ CART SERVICE-A

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  resetCart() {
    this.cartService.cartItems = [];

    // SALJE DA BUDE 0 SVIM SUBSCRIBER-IMA
    this.cartService.totalPrice.next(0);

    // SALJE DA BUDE 0 SVIM SUBSCRIBER-IMA
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
  }
}
