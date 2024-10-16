import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
// OVAJ IMPORT JE ZA BOOTSTRAP WIDGETS (KORISCENO JE ZA PAGINATION)
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';

// DEFINISEM PUTANJE
const routes: Routes = [
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'cart-details', component: CartDetailsComponent
  },
  {
    path: 'products/:id', component: ProductDetailsComponent
  },
  {
    path: 'search/:keyword', component: ProductListComponent
  },
  {

    // DODAJEM PUTANJU KOJA CE DA SE KORISTI, I KADA SE PUTANJA POKLOPI ONDA CE SE DALJI PROCES PREUZETI U KOMPONENTI ProductListComponent

    // REDOSLED PUTANJI JE BITAN, PRVO PISEM ONE NAJSPECIFICNIJE A NA KRAJU STAVLJAM ONE NAJPROSTIJE

    //path: 'category/:id', component: ProductListComponent

    path: 'category/:id/:name', component: ProductListComponent
  },
  {
    path: 'category', component: ProductListComponent
  },
  {
    path: 'products', component: ProductListComponent
  },
  {

    // ZA redirectTo MORA DA SE PISE '/' U PUTANJU, I MORA DA SE POKLAPA POTPUNO SA PUTANJOM A NE SAMO PO PREFIKSU (BILO STA STO POCINJE SA DATIM PREFIKSOM DA SE PRIHVATA)
    // AKO NE DAJU PUTANJU ONDA SE PREUSMERAVAJU NA /products
    path: '', redirectTo: '/products', pathMatch: 'full'
  },
  {

    // AKO SE PUTANJA NE POKLAPA NI SA JEDNOM OD PRETHODNIH PUTANJAMA ONDA SE PREUSMERAVA NA /products
    path: '**', redirectTo: '/products', pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // MODIFIKOVAN FAJL index.d.ts linija 3210 jer je obrisan @deprecated za HttpClientModule
    HttpClientModule,
    RouterModule.forRoot(routes),
    // DODAO SAM PUTANJE KOJE SAM KREIRAO GORE 
    
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
