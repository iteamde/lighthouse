import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../app.model';
import { ProjectService } from '../../@services/project.service';
import { FirestoreService } from '../../@services/firestore.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { ProductService } from '../../@services/product.service';
import { fastFade } from '../../animations';

@Component({
  selector: 'product-tile',
  templateUrl: './product-tile.component.html',
  styleUrls: ['./product-tile.component.scss'],
  animations: [fastFade]
})
export class ProductTileComponent implements OnInit {
  @Input('product')
  product: Product;
  @Input()
  projectCart: String;

  menu$;
  krap$;
  q;

  symbol: '$';

  constructor(
    private projectService: ProjectService,
    private productService: ProductService,
    public afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.updateQuantity();
  }

  addToCart() {
    this.projectService
      .addToProject(this.product)
      .then(() => this.updateQuantity());
    console.log(this.product);
  }

  updateQuantity() {
    const projectDoc = this.projectService.getProjectId();

    const singleProduct = this.product.id.toString();

    if (projectDoc) {
      this.afs
        .collection('projects')
        .doc(projectDoc)
        .collection('items')
        .doc(singleProduct)
        .valueChanges()
        .subscribe(fooBarItem => {
          if (fooBarItem) {
            this.q = fooBarItem['quantity'];
          }

          if (fooBarItem === null) {
            return 0;
          }
        });
    }
  }

  removeFromCart() {
    this.projectService.removeFromProject(this.product);
    console.log(this.q);
  }

  setCurrentProduct(id) {
    this.productService.currentProduct = id;
  }
}
