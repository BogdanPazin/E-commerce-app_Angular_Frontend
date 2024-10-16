import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  constructor(private router: Router){

  }

  ngOnInit(): void {
    
  }

  doSearch(value: String){
    console.log(`value=${value}`);
    
    // SA OVIM SE ZOVE KREIRANA PUTANJA, KOJA CE SE OBRADJIVATI U KOMPONENTI ProductListComponent
    this.router.navigateByUrl(`/search/${value}`);
  }
}
