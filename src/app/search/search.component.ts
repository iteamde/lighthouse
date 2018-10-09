import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationEnd
} from '../../../node_modules/@angular/router';
import { ProductService } from '../@services/product.service';
import { listStagger } from '../animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [listStagger]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchSubscription: Subscription;
  products$;
  categories$;

  searchQuery: string;
  _progressSpinner = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.searchSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseCatalogue();
      }
    });
  }

  ngOnInit() {}

  initialiseCatalogue() {
    this.route.paramMap.subscribe(params => {
      this.searchQuery = params.get('search');
    });

    // Get Product data from API
    this.productService.searchProduct(this.searchQuery).subscribe(data => {
      this.products$ = data;
      this._progressSpinner = false;
      console.log(data);
    });

    console.log(this.searchQuery);
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }
}
