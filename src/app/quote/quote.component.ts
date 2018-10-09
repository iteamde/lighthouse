import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProjectService } from '../@services/project.service';
import { FirestoreService } from '../@services/firestore.service';
import { Product } from '../app.model';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../@services/auth.service';
import * as moment from 'moment';
import { BookingService } from '../@services/booking.service';
import { Router } from '@angular/router';
import { QuoteService } from '../@services/quote.service';

interface Item {
  product: Product;
  quantity: number;
  content: string;
}

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {
  items: Observable<Item[]>;
  itemInfo;

  projectTitle;
  projectId;
  project = {};
  projectSubscription: Subscription;
  projectDetailsGroup: FormGroup;
  state: string;
  uid;

  dateDetails;

  cartItems;

  totalPrice: number;

  minDateValue: moment.Moment = moment(); // Minimum date for date range picker

  @Input('type')
  type;
  @Output()
  quoteToggle = new EventEmitter<boolean>();
  projectCartTotalCost: number;

  toggleQuote() {
    this.quoteToggle.emit(true);
  }

  constructor(
    public quoteService: QuoteService,
    public auth: AuthService,
    private bookingService: BookingService,
    public projectService: ProjectService,
    public db: FirestoreService,
    public afs: AngularFirestore
  ) {
    this.projectId = this.projectService.getProjectId();
    // Subscribe to Cart items
    this.items = this.db.colWithIds$('projects/' + this.projectId + '/items');
    this.dateDetails = this.projectService.dateDetails;
    this.projectDetailsGroup = this.bookingService.projectDetails;
  }

  async ngOnInit() {
    this.projectService.itemValue.subscribe(nextValue => {
      this.items = this.db.colWithIds$('projects/' + nextValue + '/items');
      this.projectId = nextValue;
      // this.projectService.subscribeToProject()
      if (nextValue) {
        console.log('[Project] New project ID', nextValue);
      } else {
        console.log('[Project] Cleared Project');
      }
    });
  }

  async newProject() {
    this.projectId = (await this.projectService.getProject()).valueChanges();

    this.items = this.db.colWithIds$('projects/' + this.projectId + '/items');

    this.afs
      .doc('projects/' + this.projectId)
      .valueChanges()
      .subscribe(data => (this.project = data));
  }

  onDomChange(event) {
    console.log('DOM CHANGED');
  }

  // onDateChanged(event) {
  //   console.log('changed', event);

  //   if (event === 'clear') {
  //     console.log('[Quote] Clear Dates');
  //     this.projectService
  //       .getProjectLoaded()
  //       .update({ dateRange: { start: '', end: '' } });
  //   } else {
  //     let dateStart = new Date(event.start);
  //     let dateEnd = new Date(event.end);

  //     this.projectDetailsGroup
  //       .get('dateRange')
  //       .patchValue({ start: dateStart, end: dateEnd });
  //     console.log('Start: ', dateStart, 'End: ', dateEnd);
  //   }
  // }
}
