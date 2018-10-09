import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../@services/menu.service';
import { SeoService } from '../../@services/seo.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sponsorship',
  templateUrl: './sponsorship.component.html',
  styleUrls: ['./sponsorship.component.scss']
})
export class SponsorshipComponent implements OnInit, OnDestroy {
  constructor(
    private menuService: MenuService,
    private seo: SeoService,
    private http: HttpClient
  ) {}

  data;

  ngOnInit() {
    this.getData();

    this.menuService.invert = true;
    this.menuService.quoteOpened = false;
    this.seo.generateTags({
      title: 'Sponsorship - Lighthouse Rentals',
      description:
        'Lighthouse supports emerging filmmakers. Film lighting discounts available on Short Films, Music Videos, Webseries and any other self-funded personal projects being shot in Melbourne',
      image: 'https://instafire-app.firebaseapp.com/assets/meerkat.jpeg',
      slug: 'sponsorship'
    });
  }

  url = 'https://lhf.cms.luminuxlab.com/wp-json/wp/v2/pages/34';

  getData() {
    this.http.get(this.url).subscribe(data => (this.data = data));
  }

  ngOnDestroy() {
    this.menuService.invert = false;
  }
}
