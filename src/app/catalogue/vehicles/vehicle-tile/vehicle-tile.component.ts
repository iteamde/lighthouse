import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../app.model';
import { ProjectService } from '../../../@services/project.service';
import { FirestoreService } from '../../../@services/firestore.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { ProductService } from '../../../@services/product.service';

@Component({
  selector: 'vehicle-tile',
  templateUrl: './vehicle-tile.component.html',
  styleUrls: ['./vehicle-tile.component.scss']
})
export class VehicleTileComponent implements OnInit {
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
    private db: FirestoreService,
    public afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.subscribeToQuantity();
  }

  addToCart() {
    this.projectService
      .addToProject(this.product)
      .then(data => this.subscribeToQuantity());
    console.log(this.product);
  }

  subscribeToQuantity() {
    let projectDoc = this.projectService.getProjectId();

    let singleProduct = this.product.id.toString();

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
