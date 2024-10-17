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
  
  products: Product[] = [];

  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";

  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  
  previousKeyword: string = "";
  
  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute){

  }

  ngOnInit(): void{
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  public listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }


  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else{
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


    this.productService.getProductListPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(this.proccessResult());


    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   KADA SE PODACI VRATE, DODELJUJE SE ODGOVARAJUCEM PARAMETRU
    //   data => {
    //     this.products = data;
    //   }
    // );
  }


  handleSearchProducts() {
   const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    this.productService.searchProductsPaginate(
      this.thePageNumber - 1, 
      this.thePageSize, theKeyword).subscribe(
      this.proccessResult()
    );


  // this.productService.searchProducts(theKeyword).subscribe(
  //     data => {
  //       this.products = data;
  //     }
  //   );
  }

  proccessResult() {
    return (data: any) => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: string) {
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
