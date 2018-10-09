import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../@services/error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  constructor(public errorService: ErrorService) {}

  error;

  ngOnInit() {
    this.error = this.errorService.latestError;
    console.error(this.error);
  }
}
