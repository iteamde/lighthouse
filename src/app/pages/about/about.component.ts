import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../@services/menu.service';
import { SeoService } from '../../@services/seo.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
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
      title: 'About - Lighthouse Rentals',
      description:
        'A good film set is like a well oiled machine. Lighting may seem like a small part of that, but it is a key element of every frame. Lighthouse Rentals wants to put the emphasis back on beautiful lighting, and we want to support emerging filmmakers while we do it.',
      image: 'https://instafire-app.firebaseapp.com/assets/meerkat.jpeg',
      slug: 'about'
    });
  }

  url = 'https://lhf.cms.luminuxlab.com/wp-json/wp/v2/pages/36';

  getData() {
    this.http.get(this.url).subscribe(data => (this.data = data));
  }

  ngOnDestroy() {
    this.menuService.invert = false;
  }
}
