import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { listStagger } from '../animations';
import { MenuService } from '../@services/menu.service';

@Component({
  selector: 'app-inspirations',
  templateUrl: './inspirations.component.html',
  styleUrls: ['./inspirations.component.scss'],
  animations: [listStagger]
})
export class InspirationsComponent implements OnInit {
  constructor(private http: HttpClient, private menuService: MenuService) {}

  inspo;

  shootFilter;

  dayFilter = false;
  nightFilter = false;
  outdoorFilter = false;
  indoorFilter = false;

  url =
    'https://lhf.cms.luminuxlab.com/wp-json/acf/v3/inspirations?filter[meta_query][relation]=AND&';

  displayed = false;
  displayedItem;

  displayedItemGear = [];

  ngOnInit() {
    this.menuService.quoteOpened = false;
    this.getData();
  }

  getData() {
    let query;

    if (this.shootFilter) {
      query +=
        'filter[meta_query][0][key]=shoot_type&filter[meta_query][0][value]=' +
        this.shootFilter +
        '&';
    }
    if (this.indoorFilter === true) {
      query +=
        'filter[meta_query][1][key]=location&filter[meta_query][1][value]=indoor&';
    }
    if (this.outdoorFilter === true) {
      query +=
        'filter[meta_query][2][key]=location&filter[meta_query][2][value]=outdoor&';
    }
    if (this.dayFilter === true) {
      query +=
        'filter[meta_query][3][key]=time_of_day&filter[meta_query][3][value]=day&';
    }
    if (this.nightFilter === true) {
      query +=
        'filter[meta_query][4][key]=time_of_day&filter[meta_query][4][value]=night&';
    }
    this.http.get(this.url + query).subscribe(data => (this.inspo = data));
  }

  changeShootType(event) {
    console.log(event.value);

    this.shootFilter = event.value;

    this.getData();
  }

  filterSwitch(type) {
    if (type === 'day') {
      this.dayFilter = !this.dayFilter;
      if (this.dayFilter) {
        this.nightFilter = false;
      }
    }
    if (type === 'night') {
      this.nightFilter = !this.nightFilter;
      if (this.nightFilter) {
        this.dayFilter = false;
      }
    }
    if (type === 'outdoor') {
      this.outdoorFilter = !this.outdoorFilter;
      if (this.outdoorFilter) {
        this.indoorFilter = false;
      }
    }
    if (type === 'indoor') {
      this.indoorFilter = !this.indoorFilter;
      if (this.indoorFilter) {
        this.outdoorFilter = false;
      }
    }

    this.getData();
  }

  getProductData(id) {
    let productData;

    this.http
      .get('https://lhb.luminuxlab.com/api/products/item/' + id)
      .subscribe(data => {
        productData = data;
        this.displayedItemGear.push(data);
      });
    return productData;
  }

  showInspo(item) {
    console.log('show', item);
    this.displayed = true;
    this.displayedItem = item;
    this.displayedItemGear = [];

    for (const gearItem in this.displayedItem.acf.gear) {
      if (gearItem) {
        this.getProductData(this.displayedItem.acf.gear[gearItem].name);
      }
    }
  }

  closeInspo() {
    this.displayed = false;
  }
}
