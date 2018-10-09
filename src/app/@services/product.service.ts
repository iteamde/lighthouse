import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  currentProduct;

  constructor(private http: HttpClient) {}

  /////////////////////////////
  //  Get products from API  //
  /////////////////////////////

  getData(id) {
    return this.http.get('https://lhb.luminuxlab.com/api/products' + id);
  }

  ///////////////////////////////////
  //  Get single product from API  //
  ///////////////////////////////////

  getSingleProduct(slug) {
    return this.http.get(
      'https://lhb.luminuxlab.com/api/products/slug/' + slug
    );
  }

  ////////////////////////////////////
  //  Get products from local JSON  //
  ////////////////////////////////////

  getDataLocal() {
    return this.http.get('http://localhost:4200/assets/daylight.json');
  }

  ////////////////////////////////////
  //      Search for products       //
  ////////////////////////////////////

  searchProduct(query) {
    return this.http.get('https://lhb.luminuxlab.com/api/search/' + query);
  }
}
