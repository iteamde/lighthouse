import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../@services/booking.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
  bookingDetails;

  constructor(public bookingService: BookingService) {}

  ngOnInit() {
    this.bookingDetails = this.bookingService.successDetails;
  }
}
