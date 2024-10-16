// OVO JE OBICNA TYPESCIRPT KLASA KOJA SE IZVRSAVA NA USER WEBPAGE

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // URL-OVI KOJI SE OMOGUCAVAJU IZ SPRING BOOT-A
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  // HTTP CLIENT MI JE ZAPRAVO REST CLIENT
  constructor(private httpClient: HttpClient) {

  }

  public getProductListPaginate(thePage: number, 
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts>{

    // PRAVIM URL NA OSNOVU ID KATEGORIJE, STRANICE I VELICINE STRANICE
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${thePageSize}`;


    // PRAVI SE GET REQUEST NAPRAVLJENOM BASEURL/SEARCHURL, UZIMA PODATKE I PAKUJE GA I OMOGUCAVA DA SE PRISTUPA KAO NIZU PRODUCTS-A
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  // OVA METODA SLUZI DA MAPIRA JSON PODATKE IZ SPRING DATA REST U NIZ PRODUCT-A
  public getProductList(theCategoryId: number): Observable<Product[]>{

    // PRAVIM URL NA OSNOVU ID KATEGORIJE
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;


    // PRAVI SE GET REQUEST NAPRAVLJENOM BASEURL/SEARCHURL, UZIMA PODATKE I PAKUJE GA I OMOGUCAVA DA SE PRISTUPA KAO NIZU PRODUCTS-A
    return this.getProducts(searchUrl);
  }

  public getProductCategories(): Observable<ProductCategory[]> {
    
    // POZIVAM REST API, VRACA OBSERVABLE I NJEGA MAPIRAM U NIZ productCategory
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    
    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(productId: number): Observable<Product> {
    // PRAVIM URL: localhost:8080/api/products/75849320
    const productUrl = `${this.baseUrl}/${productId}`;

    // ZA OVO NE MORA DA SE VRSI POSEBNO OTPAKIVANJE JSON-A KOJI SE DOBIJA OD STRANE SPRING DATA REST JER SE ON AUTOMATSKI MOZE KONVERTOVATI U OBJEKAT TIPA Product
    return this.httpClient.get<Product>(productUrl);
  }

  public searchProductsPaginate(thePage: number, 
    thePageSize: number,
    theKeyword: string): Observable<GetResponseProducts>{

    // PRAVIM URL NA OSNOVU KEYWORD-A, STRANICE I VELICINE STRANICE
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` + `&page=${thePage}&size=${thePageSize}`;


    // PRAVI SE GET REQUEST NAPRAVLJENOM BASEURL/SEARCHURL, UZIMA PODATKE I PAKUJE GA I OMOGUCAVA DA SE PRISTUPA KAO NIZU PRODUCTS-A
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
}


// INTERFACE KOJI POMAZE U OTPAKIVANJU JSON-A KOJI DOLAZI IZ SPRING DATA REST API
interface GetResponseProducts{
  _embedded: {
    products: Product[];
  },

  // OVO JE ZA PAGINATION, SVE OVE PODATKE DOBIJAM NA KRAJU JSON STRINGA OD SPRING DATA REST
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}