import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../@services/menu.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  constructor(private menuService: MenuService, private http: HttpClient) {}

  data;

  ngOnInit() {
    this.menuService.quoteOpened = false;
    this.getData();
  }

  url = 'https://lhf.cms.luminuxlab.com/wp-json/wp/v2/pages/45';

  getData() {
    this.http.get(this.url).subscribe(data => (this.data = data));
  }
}
