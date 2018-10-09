import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  showRequestButton = true;
  showAddRemoveButtons = true;

  showQuote = true;

  permanentlyOpen = false;

  quoteHeight;

}
