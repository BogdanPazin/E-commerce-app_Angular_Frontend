import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  //templateUrl: './product-list.component.html',
  //templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  
  //OVI ATRIBUTI SE MOGU KORISTITI U ODGOVARAJUCEM HTML FAJLU
  products: Product[] = [];

  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";

  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  
  previousKeyword: string = "";
  

  // ACTIVATEDROUTE JE PUTANJA KOJA JE UCITALA OVU KOMPONENTU NA POCETKU, ONA JE KORISNA DA SE PRISTUPAJU PARAMETRI PUTANJE
  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute){

  }

  // KAD JE ANGULAR KOMPONENTA INICIJALIZOVANA POZIVA SE ngOnInit I ONA JE SLICNA KAO @POSTCONSTRUCT
  ngOnInit(): void{
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  // METOD SE IZVRSAVA POSLE SUBSCRIBE
  public listProducts() {

    // OVAJ PARAMETAR MORA DA IMA ISTO IME KAO ONAJ KOJI JE NAVEDEN PRILIKOM KREIRANJA PUTANJE
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    
    // AKO IMA TAKAV PARAMETAR ZA PRETRAGU ONDA SE VRSI PRETRAGA
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }


  handleListProducts(){
     // PROVERAVAM DA LI JE ID PARAMETAR SLOBODAN, AKO JESTE ONDA DA GA ISKORISTIM ILI DA KORISTIM NEKU DEFAULT VREDNOST
    // paramMap JE MAPA SVIH PARAMETARA
    // OVO IME id JE IZ SAMOG KREIRANJA PUTANJA, GDE JE STAVLJENO U OBLIKU: category/:id
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      // SA + SE KONVERTUJE STRING U NUMBER
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else{
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }


    // ZA PAGINATION PROVERAVAM DA LI IMAM DRUGU KATEGORIJU OD PRETHODNE, PRI CEMU CE ANGULAR KORISTITI ISTU KOMPONENTU AKO SE ONA TRENUTNO KORISTI STO ZNACI DA NECE PRAVITI NOVU

    // AKO IMAM DRUGU KATEGORIJU OD PRETHODNE ONDA RESETUJEM BROJ STRANICE NA 1 (U ANGULAR STRANICE BROJ STRANICA KRECE OD 1 A U SPRING DATA REST KRECE OD 0)
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


    this.productService.getProductListPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(this.proccessResult());


    // SADA UZIMAM PROIZVODE ZA ODGORAVAJUCU KATEGORIJU
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   KADA SE PODACI VRATE, DODELJUJE SE ODGOVARAJUCEM PARAMETRU
    //   data => {
    //     this.products = data;
    //   }
    // );
  }


  handleSearchProducts() {
   const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // AKO IMAM DRUGACIJI KEYWORD NEGO PRE ONDA NAMESTAM BROJ STRANICE NA 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);


    // OVAJ DEO JE VEZAN ZA PRETRAGU POMOCU KEYWORD-A I PAGINATION
    this.productService.searchProductsPaginate(
      this.thePageNumber - 1, 
      this.thePageSize, theKeyword).subscribe(
      this.proccessResult()
    );



  //  SADA TRAZIM PROIZVODE SA TIM KEYWORD-OM
  // this.productService.searchProducts(theKeyword).subscribe(
  //     data => {
  //       this.products = data;
  //     }
  //   );
  }

  proccessResult() {
    return (data: any) => {
        // PODACI SA DESNE STRANE SU PODACI DOBIJENI OD STRANE SPRING DATA REST U OBLIKU JSON STRINGA I TO SU PODACI IZ INTERFACE-A GetResponseProducts IZ ProductService-A
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: string) {
    // KONVERTUJE SE PROSLEDJENI STRING U NUMBER
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product){
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);

    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
  }
}