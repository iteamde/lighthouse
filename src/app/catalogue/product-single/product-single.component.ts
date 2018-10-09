import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from '../../@services/project.service';
import { ProductService } from '../../@services/product.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Location } from '@angular/common';
import { fadeAnimation } from '../../animations';
import { SeoService } from '../../@services/seo.service';
import { QuoteService } from '../../@services/quote.service';

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.scss'],
  animations: [fadeAnimation]
})
export class ProductSingleComponent implements OnInit, OnDestroy {
  product;
  productQuery;
  _progressSpinner = true;

  constructor(
    private projectService: ProjectService,
    private productService: ProductService,
    private seo: SeoService,
    private quoteService: QuoteService,
    private _location: Location,
    private route: ActivatedRoute
  ) {
    this.quoteService.permanentlyOpen = true;
    this.route.paramMap.subscribe(params => {
      this.productQuery = params.get('id');
    });
  }

  ngOnInit() {
    this.productService.getSingleProduct(this.productQuery).subscribe(data => {
      this.product = data;
      this.seoTags();
      console.log(data);
      this._progressSpinner = false;
    });
  }

  seoTags() {
    if (this.product.image_info) {
      this.seo.generateTags({
        title: this.product.name + ' - Lighthouse',
        description: this.product.description,
        image: this.product.image_info.url,
        slug: 'product/' + this.product.slug
      });
    } else {
      this.seo.generateTags({
        title: this.product.name + ' - Lighthouse',
        description: this.product.description,
        slug: 'product/' + this.product.slug
      });
    }
  }

  addToProject() {
    this.projectService.addToProject(this.product);
  }

  backClicked() {
    this._location.back();
  }

  removeFromCart() {
    this.projectService.removeFromProject(this.product);
  }

  ngOnDestroy() {
    this.quoteService.permanentlyOpen = false;
  }
}
