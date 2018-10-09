import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { User, Item } from '../app.model';
import { Observable, of } from 'rxjs';
import { ProjectService } from '../@services/project.service';
import { FirestoreService } from '../@services/firestore.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../@services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import { UserService } from '../@services/user.service';
import { first } from 'rxjs/operators';
import { ErrorService } from '../@services/error.service';
import {
  ScrollToService,
  ScrollToConfigOptions
} from '@nicky-lenaers/ngx-scroll-to';
import { BookingService } from '../@services/booking.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressService } from '../@services/address.service';
import { QuoteService } from '../@services/quote.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, OnDestroy {
  items: Observable<Item[]>;
  itemInfo;

  user;

  projectDetails: FormGroup;
  dateDetails: FormGroup;
  collectionReturnGroup: FormGroup;
  billingDetailsGroup: FormGroup;

  minDateValue: moment.Moment = moment(); // Minimum date for date range picker

  projectTitle;
  projectId;
  projectRef;
  project = {};
  projectItems;

  userDetails = {};

  billingInfo;
  userInfo;

  billableDays;

  myForm: FormGroup;
  projectDoc;

  customBillingGroup: FormGroup;
  customBillingSelect = 'personal';

  submitting = false;

  state: string;

  placesOptions = {
    types: ['address'],
    componentRestrictions: { country: 'AU' }
  };

  constructor(
    private _formBuilder: FormBuilder,
    public quoteService: QuoteService,
    public projectService: ProjectService,
    public bookingService: BookingService,
    private errorService: ErrorService,
    public db: FirestoreService,
    public addressService: AddressService,
    public router: Router,
    private userService: UserService,
    public auth: AuthService,
    private _scrollToService: ScrollToService,
    public afAuth: AngularFireAuth,
    public snackBar: MatSnackBar,
    public afs: AngularFirestore
  ) {}

  async ngOnInit() {
    this.quoteService.showRequestButton = false;

    // Set the Project ID
    this.projectId = this.projectService.getProjectId();

    // Set the Project reference
    this.projectRef = this.afs.doc('projects/' + this.projectId);

    // Set the Project Document
    this.projectDoc = this.projectRef.valueChanges();

    // Get the Project cart items
    this.items = this.db.colWithIds$('projects/' + this.projectId + '/items');

    this.projectDetails = this.bookingService.projectDetails;
    this.dateDetails = this.projectService.dateDetails;

    // Collection & Return Inputs (Page 2)
    this.collectionReturnGroup = this._formBuilder.group({
      collection: ['', Validators.required],
      return: ['', Validators.required]
    });

    // Billing Details Inputs (Page 3)
    this.billingDetailsGroup = this._formBuilder.group({
      billingOption: ['', Validators.required]
    });

    // Custom billing details Form Inputs
    this.customBillingGroup = this._formBuilder.group({
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      companyName: ['', Validators.required],
      billingAddress: ['', Validators.required],
      billingAddressCity: [''],
      billingAddressState: [''],
      billingAddressStreet1: [''],
      billingAddressCountry: [''],
      billingAddressPostcode: ['']
    });

    const user = await this.isLoggedIn();
    this.userService.getUser(user.uid).then(data => (this.userInfo = data));

    // Populate items array

    this.items.forEach(data => {
      this.projectItems = data;
      console.log(data);
    });
  }

  ngOnDestroy() {
    this.quoteService.showRequestButton = true;
    this.quoteService.showQuote = true;
  }

  selectOption(radio, value, cost?) {
    if (radio === 'collection') {
      const config: ScrollToConfigOptions = { target: 'return' };

      console.log(cost);

      this.collectionReturnGroup.patchValue({ collection: value });
      this.collectionReturnGroup.patchValue({ collectionPrice: cost });
      this._scrollToService.scrollTo(config);
    }

    if (radio === 'return') {
      this.collectionReturnGroup.patchValue({ return: value });
    }

    if (radio === 'billing') {
      this.billingDetailsGroup.patchValue({ billingOption: value });
    }
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  collectionReturnPrice(value) {
    if (value === 'Standard Pickup' || value === 'Standard Return') {
      return 0;
    }
    if (value === '24/7 Pickup' || value === '24/7 Return') {
      return 25;
    }
    if (value === 'Express') {
      return 55;
    }
    if (value === 'Express Priority') {
      return 70;
    }
    if (value === 'Express Afterhours') {
      return 110;
    }
  }

  validate(area) {
    if (!this.collectionReturnGroup.valid) {
      this.snackBar
        .open(
          'Please select a collection option and a return option',
          'warning'
        )
        ._dismissAfter(2500);
    }
  }

  sendBookingRequest() {
    // Sets Project data in Firestore to 'submitted'
    this.submitting = true;

    const detailsData = {
      title: this.projectDetails.value.title,
      type: this.projectDetails.value.type,
      starts_at: moment(this.dateDetails.value.dateStart).toDate(),
      ends_at: moment(this.dateDetails.value.dateEnd).toDate(),
      notes: this.projectDetails.value.notes,
      collectionOption: this.collectionReturnGroup.value.collection,
      returnOption: this.collectionReturnGroup.value.return,
      billableDays: this.dateDetails.value.billableDays
    };

    if (this.billingDetailsGroup.value.billingOption === 'personal') {
      const billingData = {
        billingFirstName: this.userInfo.firstName,
        billingLastName: this.userInfo.lastName,
        billingAddressLine1: this.userInfo.addressStreet1,
        billingAddressLine2: this.userInfo.addressStreet2,
        billingPostalCode: this.userInfo.addressPostalCode,
        billingCity: this.userInfo.addressCity,
        billingCountry: this.userInfo.addressCountry,
        billingState: this.userInfo.addressState,
        billingPhoneNumber: this.userInfo.phoneNumber,
        billingEmailAddress: this.userInfo.email
      };
      console.log('Billing Data Personal', billingData);

      this.billingInfo = billingData;
    }

    if (this.billingDetailsGroup.value.billingOption === 'company') {
      const billingData = {
        billingFirstName: this.userInfo.firstName,
        billingLastName: this.userInfo.lastName,
        billingCompanyName: this.userInfo.companyName,
        billingAddressLine1: this.userInfo.companyAddressStreet1,
        billingAddressLine2: this.userInfo.companyAddressStreet2,
        billingPostalCode: this.userInfo.companyAddressPostalCode,
        billingCity: this.userInfo.companyAddressCity,
        billingCountry: this.userInfo.companyAddressCountry,
        billingState: this.userInfo.companyAddressState,
        billingPhoneNumber: this.userInfo.phoneNumber,
        billingEmailAddress: this.userInfo.email
      };

      this.billingInfo = billingData;
    }

    if (this.billingDetailsGroup.value.billingOption === 'custom') {
      const billingData = {
        billingFirstName: this.userInfo.firstName,
        billingLastName: this.userInfo.lastName,
        billingCompanyName: this.customBillingGroup.value.companyName,
        billingAddressLine1: this.customBillingGroup.value
          .billingAddressStreet1,
        billingPostalCode: this.customBillingGroup.value.billingAddressPostcode,
        billingCity: this.customBillingGroup.value.billingAddressCity,
        billingCountry: this.customBillingGroup.value.billingAddressCountry,
        billingState: this.customBillingGroup.value.billingAddressState,
        billingPhoneNumber: this.customBillingGroup.value.phoneNumber,
        billingEmailAddress: this.customBillingGroup.value.email
      };
      this.billingInfo = billingData;
    }

    console.log(detailsData, this.projectItems, this.billingInfo);

    this.projectService
      .submitBookingRequest(
        this.userInfo.uid,
        detailsData,
        this.projectItems,
        this.billingInfo
      )
      .subscribe(
        response => {
          console.log(
            '[Booking] Successfully submitted ',
            response['opportunity'].id
          );
          console.log('[Booking] Sending confirmation email...');
          const data = response['opportunity'];

          const payload = {
            email: data.custom_fields.billing_email_address,
            returnOption: data.custom_fields.return_option,
            collectionOption: data.custom_fields.collection_option,
            memberName: data.billing_address.name,
            projectTitle: data.subject,
            projectType: data.custom_fields.project_type,
            startHeading: 'Start',
            endHeading: 'End',
            startDate: data.show_starts_at,
            endDate: data.show_ends_at,
            discountPercent: data.custom_fields.discount_percentage,
            totalPrice:
              Number(data.rental_charge_total) + Number(data.tax_total),
            discountAmount: data.custom_fields.discount_amount,
            opportunityId: data.id
          };

          this.bookingService
            .sendEmail(payload)
            .subscribe(res => console.log(res));

          this.bookingService.successDetails = data;

          // UPDATE ANGULAR FIRESTORE PROJECT DOC TO SUBMITTED
          this.afs
            .doc('projects/' + this.projectId)
            .set({ status: 'submitted' });
          this.afs
            .doc('projects/' + this.projectId + '/submission/details')
            .set(detailsData, { merge: true });
          this.afs
            .doc('projects/' + this.projectId + '/submission/billing')
            .set(this.billingInfo, { merge: true });

          this.submitting = false;
          this.router.navigate(['/booking/confirmation']);
        },
        (error: Response) => {
          this.router.navigate(['/error']);
          this.errorService.latestError = error;
        }
      );
  }

  customSelect(option) {
    this.customBillingSelect = option;
    console.log(option);
  }

  goToReview() {
    this.quoteService.showQuote = false;
  }

  addressChange(address: Address) {
    const parsedAddress = this.addressService.parseAddress(address);

    this.customBillingGroup.patchValue({
      billingAddressCity: parsedAddress.city,
      billingAddressState: parsedAddress.state,
      billingAddressStreet1: parsedAddress.street1,
      billingAddressCountry: parsedAddress.country,
      billingAddressPostcode: parsedAddress.postalCode
    });

    console.log(this.customBillingGroup.value);
  }
}
