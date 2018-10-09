import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '../../../node_modules/@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddressService } from './address.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private url = 'https://lhb.luminuxlab.com/api/email/';

  successDetails;

  projectDetails: FormGroup;

  constructor(
    private fb: FormBuilder,
    public addressService: AddressService,
    private http: HttpClient
  ) {
    this.projectDetails = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      billableDays: [],
      notes: ['']
    });
  }

  sendEmail(payload) {
    return this.http.post(this.url, payload, httpOptions);
  }
}
