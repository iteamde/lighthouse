import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../app.model';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '../../../node_modules/@angular/forms';
import * as firebase from 'firebase/app';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isThisYouData;
  isThisYouID;
  IsThisYouSingle;
  signUpDetails: FormGroup;

  private url = 'https://lhb.luminuxlab.com/api/user/';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.signUpDetails = this.fb.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      addressStreet1: ['', Validators.required],
      addressCity: ['', Validators.required],
      addressState: ['', Validators.required],
      addressCountry: ['', Validators.required],
      addressPostalCode: ['', Validators.required],

      companyIs: [''],
      companyPosition: [''],
      companyPhoneNumber: [''],
      companyAddress: [''],
      companyName: [''],
      companyAddressStreet1: [''],
      companyAddressCity: [''],
      companyAddressState: [''],
      companyAddressCountry: [''],
      companyAddressPostalCode: [''],

      currentProject: [''],

      studentIs: [''],
      studentCourseName: [''],
      studentGraduationYear: [''],
      studentSchoolName: [''],
      studentIdNumber: [''],

      uid: [''],
      rid: ['']
    });
  }

  async getUser(userId: string) {
    const response = await this.http.get<User>(this.url + userId).toPromise();
    return response;
  }

  ///////////////////////////////////////
  //  Get user data by Current RMS ID  //
  ///////////////////////////////////////

  getUserDataByRid(rid) {
    return this.http.get<User>(this.url + 'data/' + rid);
  }

  /////////////////////////////////////////
  //  Get user data by Firebase Auth ID  //
  /////////////////////////////////////////

  getUserData2(userId) {
    return this.http.get<User>(this.url + userId);
  }

  getUserData(userId) {
    return this.http
      .get<User>(this.url + userId)
      .subscribe(data => console.log('We got', data));
  }

  //////////////////////////////////////
  //  Register new User in Quickbase  //
  //////////////////////////////////////

  /////////////////////////////////////////////////////
  //  Sync existing Quickbase user to Firebase Auth  //
  /////////////////////////////////////////////////////

  newUser(user, data) {
    console.log(user);

    data.uid = user.uid;

    console.log('ITY', this.isThisYouData);

    if (!this.isThisYouData) {
      console.log('[New user] ', data);
      return this.http.post(this.url + 'new', data, httpOptions);
    } else {
      console.log('[Sync user] ', data);
      return this.http.post(this.url + 'sync', data, httpOptions);
    }
  }

  ///////////////////////////
  //  Update User details  //
  ///////////////////////////

  updateUser(userId, data) {
    console.log('Updating details...');
    return this.http.post(this.url + userId + '/edit', data, httpOptions);
  }

  /////////////////////////////////////////
  //  Check if User exists in Quickbase  //
  /////////////////////////////////////////

  checkUser(email, phone) {
    console.log('PAYLOAD: ', email, phone);
    return this.http.get(
      this.url + 'check/new?email=' + email + '&phoneNumber=' + phone
    );
  }

  //////////////////////////////////
  //  Assign 'Is This You?' Data  //
  //////////////////////////////////

  isThisYou(data) {
    this.isThisYouData = data;
  }

  deleteUser() {
    const user = firebase.auth().currentUser;

    return user
      .delete()
      .then(() => console.log('User removed from Firebase Auth'))
      .catch(error => console.log(error));
  }

  //////////////////////////////////////
  //  Build sign up data into a form  //
  //////////////////////////////////////

  startSignUp(data) {
    console.log('startsignup', data);

    this.signUpDetails.patchValue({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      address: [
        data.addressStreet1,
        data.addressCity,
        data.addressState,
        data.addressCountry
      ],
      addressStreet1: data.addressStreet1,
      addressCity: data.addressCity,
      addressState: data.addressState,
      addressCountry: data.addressCountry,
      addressPostalCode: data.addressPostalCode,

      companyIs: data.companyIs,
      companyName: data.companyName,
      companyPhoneNumber: data.companyPhoneNumber,
      companyPosition: data.companyPosition,
      companyAddress: [
        data.companyAddressStreet1,
        data.companyAddressCity,
        data.companyAddressState,
        data.companyAddressCountry
      ],
      companyAddressStreet1: data.companyAddressStreet1,
      companyAddressCity: data.companyAddressCity,
      companyAddressState: data.companyAddressState,
      companyAddressCountry: data.companyAddressCountry,
      companyAddressPostalCode: data.companyAddressPostalCode,

      studentIs: data.studentIs,
      studentCourseName: data.studentCourseName,
      studentSchoolName: data.studentSchoolName,
      studentGraduationYear: data.studentGraduationYear,
      studentIdNumber: data.studentIdNumber,
      studentVerified: data.studentVerified,
      rid: data.rid
    });

    console.log(this.signUpDetails.value);
  }

  startNewSignUp(email, phone) {
    console.log('new Signup');
    this.signUpDetails.patchValue({
      email: email,
      phoneNumber: phone
    });
  }
}
