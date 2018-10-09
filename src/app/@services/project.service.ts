import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { take } from 'rxjs/operators';
import { User, ProjectCart } from '../app.model';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private url = 'https://lhb.luminuxlab.com/api/project/';

  uid;

  quoteUpdated = new Subject();
  itemValue = new Subject();

  user: Observable<User>;

  cartDailyCost;
  cartQuantity;
  cartItems;

  dateDetails: FormGroup;

  constructor(
    private db: AngularFirestore,
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private _afAuth: AngularFireAuth
  ) {
    this._afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
      } else {
        this.uid = null;
      }
    });

    this.dateDetails = this.fb.group({
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required],
      billableDays: ['']
    });

    if (this.projectItem) {
      this.subscribeToProject();
    }
  }

  //////////////////////////////////////////
  //  Modify 'projectId' in localStorage  //
  //////////////////////////////////////////

  public delProjectItem() {
    this.itemValue.next();
    localStorage.removeItem('projectId');
  }

  set projectItem(value) {
    this.itemValue.next(value);
    localStorage.setItem('projectId', value);
  }

  get projectItem() {
    return localStorage.getItem('projectId');
  }

  public updateCurrentProject(newProject) {
    this.db
      .doc('users/' + this.uid)
      .set({ currentProject: newProject }, { merge: true });
  }

  /////////////////////////////////////
  //  Create or get current Project  //
  /////////////////////////////////////

  async getProject(): Promise<AngularFirestoreDocument<ProjectCart>> {
    const projectId = await this.getOrCreateProjectId();
    return this.db.collection('/projects/').doc(projectId);
  }

  getProjectLoaded() {
    if (this.projectItem) {
      return this.db.collection('/projects/').doc(this.projectItem);
    }
  }

  getProjectId() {
    const projectId = localStorage.getItem('projectId');
    return projectId;
  }

  private create() {
    console.log('Creating new products in Firestore');
    return this.db.collection('projects').add({
      dateCreated: new Date().getTime(),
      status: 'draft',
      title: 'My Project'
    });
  }

  private async getOrCreateProjectId(): Promise<string> {
    const projectId = localStorage.getItem('projectId');
    if (projectId) {
      return projectId;
    }

    const result = await this.create();
    this.projectItem = result.id;

    if (this.uid) {
      console.log('YES USER');
      this.db
        .doc('projects/' + result.id)
        .set({ userId: this.uid }, { merge: true });
      this.db
        .doc('users/' + this.uid)
        .set({ currentProject: result.id }, { merge: true });
    }

    return result.id;
  }

  private getItem(projectId: string, productId: string) {
    return this.db
      .collection('/projects/')
      .doc(projectId + '/items/' + productId);
  }

  ///////////////////////////
  //  Add item to Project  //
  ///////////////////////////

  async addToProject(product) {
    const projectId = await this.getOrCreateProjectId();
    const item$ = this.getItem(projectId, product.id);
    console.log('Adding to products:');
    item$
      .valueChanges()
      .pipe(take(1))
      .subscribe(item => {
        if (item) {
          item$.update({ product: product, quantity: item['quantity'] + 1 });
          console.log('+1', item['product']['name']);
        } else {
          console.log('Not in cart');
          item$.set({ product: product, quantity: 0 + 1 });
        }
      });
    this.calculateCartTotals();
    this.quoteUpdated.next();
  }

  ////////////////////////////////
  //  Remove item from Project  //
  ////////////////////////////////

  async removeFromProject(product) {
    const projectId = await this.getOrCreateProjectId();
    const item$ = this.getItem(projectId, product.id);
    console.log('Remove from products:');
    item$
      .valueChanges()
      .pipe(take(1))
      .subscribe(item => {
        if (item) {
          item$.update({ product: product, quantity: item['quantity'] - 1 });
          console.log('-1', item['product']['name']);
        } else {
          console.log('Not in cart');
          item$.set({ product: product, quantity: 0 + 1 });
        }
        if (item['quantity'] === 1) {
          item$.delete();
        }
      });
    this.quoteUpdated.next();
  }

  //////////////////////////////////////////
  //   Get previous projects from API     //
  //////////////////////////////////////////

  getProjectsAPI() {
    return this.http.get('https://lhb.luminuxlab.com/api/projects/' + this.uid);
  }

  //////////////////////////////////////////
  //    Submit booking request to API     //
  //////////////////////////////////////////

  submitBookingRequest(userId, detailsData, items, billingData) {
    const data = {
      detailsData,
      billingData,
      items
    };

    console.log('Submitting to Current RMS...', this.projectItem, data);

    return this.http.post(this.url + userId, data, httpOptions);
  }

  //////////////////////////////////////////
  //       Sub + Unsub from Project       //
  //////////////////////////////////////////

  subscribeToProject() {
    // Subscribe to Project
    this.getProjectLoaded()
      .valueChanges()
      .subscribe(data => {
        if (data) {
          this.calculateCartDailyCost();
          this.calculateCartQuantity();
          this.updateDates();
        } else {
          console.log('[Quote] ' + 'No project loaded');
        }
      });
  }

  unsubscribeFromProject() {
    console.log('[Unsubscribe]');
    this.cartDailyCost = null;
    this.cartQuantity = null;
    this.cartItems = null;
  }

  //////////////////////////////////////////
  //          Calculate totals            //
  //////////////////////////////////////////

  calculateCartTotals() {
    this.calculateCartDailyCost();
    this.calculateCartQuantity();
  }

  calculateCartDailyCost() {
    if (this.getProjectLoaded()) {
      this.getProjectLoaded()
        .collection('items')
        .valueChanges()
        .subscribe(products => {
          this.cartDailyCost = 0;
          for (const product in products) {
            if (product) {
              this.cartDailyCost +=
                products[product].quantity * products[product].product.price;
            }
          }
          this.quoteUpdated.next();
          console.log('[Project] Project Daily Cost ', +this.cartDailyCost);
        });
    } else {
      console.log('[Project] Project not loaded yet');
    }
  }

  calculateCartQuantity() {
    this.getProjectLoaded()
      .collection('items')
      .valueChanges()
      .subscribe(project => {
        this.cartQuantity = 0;
        for (const productId in project) {
          if (productId) {
            this.cartQuantity += project[productId].quantity;
          }
        }
      });
  }

  updateDates() {
    console.log('Updating dates');
    this.getProjectLoaded()
      .valueChanges()
      .subscribe(data => {
        this.dateDetails.patchValue({
          dateStart: moment(data['dateRange'].start.seconds * 1000),
          dateEnd: moment(data['dateRange'].end.seconds * 1000),
          billableDays: data['billableDays']
        });
      });
  }

  getPDF(id) {
    this.http.get(this.url + id + '/pdf');
  }
}
