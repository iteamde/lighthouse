import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../app.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../@services/auth.service';
import { UserService } from '../../@services/user.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressService } from '../../@services/address.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  companyOpenState = false;
  studentOpenState = false;
  personalOpenState = true;

  companyDisabled = true;
  studentDisabled = true;
  personalDisabled = true;

  companySaving = false;
  studentSaving = false;
  personalSaving = false;

  personalStreet1;
  personalCity;
  personalState;
  personalCountry;
  personalPostalCode;

  companyStreet1;
  companyCity;
  companyState;
  companyCountry;
  companyPostalCode;

  progressSpinner = true;

  accountDetailsGroup: FormGroup;

  companyDetailsGroup: FormGroup;
  studentDetailsGroup: FormGroup;

  user: User;

  verifiedStudent;

  myDoc;

  state: string;

  constructor(
    private _formBuilder: FormBuilder,
    public auth: AuthService,
    public http: HttpClient,
    public addressService: AddressService,
    private userService: UserService,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore
  ) {
    //// Get auth data, then get firestore user document || null
    this.user = this.auth.userDetails;
  }

  ngOnInit() {
    this.personalOpenState = true;
    // Initialise Account details form

    this.companyDetailsGroup = this._formBuilder.group({
      companyName: ['', Validators.required],

      companyAddressCity: ['', Validators.required],
      companyAddressCountry: ['', Validators.required],
      companyAddressPostalCode: ['', Validators.required],
      companyAddressState: ['', Validators.required],
      companyAddressStreet1: ['', Validators.required]
    });

    (this.studentDetailsGroup = this._formBuilder.group({
      studentCourseName: [''],
      studentSchoolName: [''],
      studentGraduationYear: [''],
      studentIdNumber: ['']
    })),
      this.companyDetailsGroup.patchValue({
        companyName: this.user.companyName,

        companyAddressCity: this.user.companyAddressCity,
        companyAddressCountry: this.user.companyAddressCountry,
        companyAddressPostalCode: this.user.companyAddressPostalCode,
        companyAddressState: this.user.companyAddressState,
        companyAddressStreet1: this.user.companyAddressStreet1
      });

    this.studentDetailsGroup.patchValue({
      studentSchoolName: this.user.studentSchoolName,
      studentCourseName: this.user.studentCourseName,
      studentGraduationYear: this.user.studentGraduationYear,
      studentIdNumber: this.user.studentIdNumber
    }),
      (this.verifiedStudent = this.user.studentVerified);
    this.progressSpinner = false;
  }

  // Saving methods

  savePersonal(user) {
    delete user.address;

    if (!this.personalCity) {
      delete user.addressCity;
      delete user.addressCountry;
      delete user.addressPostalCode;
      delete user.addressState;
      delete user.addressStreet1;
    }

    console.log(user);

    const data = { user };

    console.log('[Account] Saving user details... (Personal)', data);
    this.personalSaving = true;

    this.userService
      .updateUser(this.auth.currentUserId, data)
      .subscribe((response: any) => {
        console.log('[Account] ', response);
        this.auth.currentUserData(); // Update user data in API
        this.personalSaving = false;
        this.personalDisabled = true;
      });
  }

  saveStudent(user) {
    delete user.address;

    console.log(user);

    const data = { user };

    console.log('[Account] Saving user details... (Student)', data);
    this.studentSaving = true;

    this.userService
      .updateUser(this.auth.currentUserId, data)
      .subscribe((response: any) => {
        console.log('[Account] ', response);
        this.auth.currentUserData(); // Update user data in API
        this.studentSaving = false;
        this.studentDisabled = true;
      });
  }

  saveCompany(user) {
    console.log(user);

    const data = { user };

    console.log('[Account] Saving user details... (Company)', data);
    this.companySaving = true;

    this.userService
      .updateUser(this.auth.currentUserId, data)
      .subscribe((response: any) => {
        console.log('[Account] ', response);
        this.auth.currentUserData(); // Update user data in API
        this.companySaving = false;
        this.companyDisabled = true;
      });
  }

  // Enable editing methods
  switchPersonal() {
    this.personalDisabled = !this.personalDisabled;
  }

  switchCompany() {
    this.companyDisabled = !this.companyDisabled;
  }

  switchStudent() {
    this.studentDisabled = !this.studentDisabled;
  }

  // Address change methods

  personalAddressChange(address: Address) {
    const parsedAddress = this.addressService.parseAddress(address);

    (this.personalCity = parsedAddress.city),
      (this.personalState = parsedAddress.state),
      (this.personalStreet1 = parsedAddress.street1),
      (this.personalCountry = parsedAddress.country),
      (this.personalPostalCode = parsedAddress.postalCode);

    console.log('[Address] ', parsedAddress);
  }

  companyAddressChange(address: Address) {
    const parsedAddress = this.addressService.parseAddress(address);

    (this.companyCity = parsedAddress.city),
      (this.companyState = parsedAddress.state),
      (this.companyStreet1 = parsedAddress.street1),
      (this.companyCountry = parsedAddress.country),
      (this.companyPostalCode = parsedAddress.postalCode);

    console.log('[Address] ', parsedAddress);
  }
}
