// import { DOCUMENT } from '@angular/common';
// import { Component, Inject, OnInit } from '@angular/core';
// import { AuthService } from '@auth0/auth0-angular';
// import { CartService } from '../../services/cart.service';

// @Component({
//   selector: 'app-login-status',
//   templateUrl: './login-status.component.html',
//   styleUrls: ['./login-status.component.css']
// })
// export class LoginStatusComponent implements OnInit {

//   storage : Storage = sessionStorage;  

//   constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService, private cartService : CartService) { }

//   ngOnInit(): void {
//    this.auth.user$.subscribe((user) => {
//     if(user && user.email){
//       sessionStorage.setItem('userEmail', user.email);
//       console.log(user.email);
//       console.log(this.auth.getAccessTokenWithPopup());
//     }
//    })

  
//   }

  
//   loginWithRedirect(){
//     this.auth.loginWithRedirect();
//   }

//   logout(){
//     this.cartService.storage.clear();
//     this.auth.logout({ logoutParams: { returnTo: document.location.origin } })
//   }



// }