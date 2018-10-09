import { Component, OnInit } from '@angular/core';
import { Intercom } from 'ng-intercom';
import * as Raven from 'raven-js';
import { fade } from './animations';
import { MenuService } from './@services/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fade]
})
export class AppComponent implements OnInit {
  public innerScroll: number;

  constructor(public intercom: Intercom, public menuService: MenuService) {
    if (!Raven.isSetup()) {
      console.log('Raven is not running');
    }

    this.innerScroll = 0;
  }

  ngOnInit() {
    console.log(
      '%c ',
      'color: red; font-family: sans-serif; padding: 22px 150px; position: absolute; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px; background-position: center; background-repeat: no-repeat; background-size: contain; background-image: url(https://lighthouserentals.com.au/assets/logo.png)'
    );
    console.log(
      '%cStop! Please contact us at hello@lighthouserentals.com.au if you are having problems with the site.',
      'color: red; font-family: sans-serif; position: absolute; font-size: 2em; font-weight: bolder; text-shadow: #000 1px 1px;'
    );

    this.intercom.boot({
      app_id: 'q12g12yk',
      // Supports all optional configuration
      widget: {
        activator: '#intercom'
      }
    });
  }

  scrollMonitor(event) {
    if (event < this.innerScroll) {
      this.menuService.scrollingDown = false;
    } else {
      this.menuService.scrollingDown = true;
    }

    this.innerScroll = event;
    this.menuService.scrollPosition = event;
  }
}
