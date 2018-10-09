import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../@services/product.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { listStagger } from '../../animations';
import { MenuService } from '../../@services/menu.service';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { QuoteService } from '../../@services/quote.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
  animations: [listStagger]
})
export class VehiclesComponent implements OnInit, OnDestroy {
  catalogueSubscription;

  products$;
  categories$;

  id: string;
  cat: string;
  subId: string;

  _progressSpinner = true;

  constructor(
    private menuService: MenuService,
    public breakpointObserver: BreakpointObserver,
    private quoteService: QuoteService,
    private router: Router,
    private productService: ProductService
  ) {
    this.quoteService.permanentlyOpen = true;
    this.catalogueSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseCatalogue();
      }
    });
  }

  initialiseCatalogue() {
    this.id = '/vehicles';

    // Get Product data from API
    this.productService.getData(this.id).subscribe(data => {
      this.products$ = data;
      this._progressSpinner = false;
    });
  }

  ngOnInit() {
    // Breakpoints
    this.breakpointObserver
      .observe(['(min-width: 1420px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.menuService.quoteOpened = true;
        } else {
          this.menuService.quoteOpened = false;
        }
      });
  }

  ngOnDestroy() {
    this.quoteService.permanentlyOpen = false;
    if (this.catalogueSubscription) {
      this.catalogueSubscription.unsubscribe();
    }
  }
}
