import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../@services/product.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { listStagger } from '../animations';
import { SeoService } from '../@services/seo.service';
import { MenuService } from '../@services/menu.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { QuoteService } from '../@services/quote.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
  animations: [listStagger]
})
export class CatalogueComponent implements OnInit, OnDestroy {
  catalogueSubscription;

  products$;
  categories$;

  id: string;
  cat: string;
  subId: string;

  order;
  sort;

  showSort = false;

  _progressSpinner = true;

  constructor(
    private route: ActivatedRoute,
    private seo: SeoService,
    public breakpointObserver: BreakpointObserver,
    private router: Router,
    private quoteService: QuoteService,
    private menuService: MenuService,
    private productService: ProductService
  ) {
    this.quoteService.permanentlyOpen = true;
    this.catalogueSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        // this.products$ = null;
        this.initialiseCatalogue();
      }
    });
  }

  initialiseCatalogue() {
    this.products$ = '';
    this._progressSpinner = true;

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.cat = params.get('category');
      if (this.id === 'all') {
        this.id = '/products';
      }
      if (this.cat) {
        this.subId = this.id;
        this.id = '/' + this.cat + '/' + this.subId;
      }
    });

    this.route.queryParams.subscribe(params => {
      this.order = params.order;
      this.sort = params.sort;
    });

    if (this.sort) {
      this.productService
        .getData(this.id + '?sort=' + this.sort + '&order=' + this.order)
        .subscribe(data => {
          this.products$ = data;
          this._progressSpinner = false;
        });
    } else {
      this.productService.getData(this.id).subscribe(data => {
        this.products$ = data;
        this._progressSpinner = false;
      });
    }
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

    this.seo.generateTags({
      title:
        this.cat.replace(/\b\w/g, l => l.toUpperCase()) +
        ' - Lighthouse Rentals',
      description:
        'Melbourne film lighting for hire at Lighthouse Rentals. Arri Skypanels, M18 HMI lights and much more available for hire.',
      slug: 'catalogue/' + this.id
    });
  }

  ngOnDestroy() {
    this.quoteService.permanentlyOpen = false;

    if (this.catalogueSubscription) {
      this.catalogueSubscription.unsubscribe();
    }

    console.log('Leaving Catalogue...');
  }

  toggleSort() {
    this.showSort = !this.showSort;
  }
}
