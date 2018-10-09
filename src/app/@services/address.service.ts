import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  placesOptions = {
    types: ['address'],
    componentRestrictions: { country: 'AU' }
  };

  constructor() {}

  parseAddress(address) {
    if (address.types[0] === 'street_address') {
      console.log('Street Address');
      return this.streetAddress(address);
    }

    if (address.types[0] === 'subpremise') {
      console.log('Subpremise Address');
      return this.subpremise(address);
    }
  }

  private streetAddress(address) {
    const details = address.address_components;

    const city = details[2].long_name;
    const state = details[4].long_name;
    const street1 = details[0].short_name + ' ' + details[1].long_name;
    const country = details[5].long_name;
    const postalCode = details[6].long_name;

    return { city, state, street1, country, postalCode };
  }

  private subpremise(address) {
    const details = address.address_components;

    const city = details[3].long_name;
    const state = details[5].long_name;
    const street1 = address.name;
    const country = details[6].long_name;
    const postalCode = details[7].long_name;

    return { city, state, street1, country, postalCode };
  }
}
