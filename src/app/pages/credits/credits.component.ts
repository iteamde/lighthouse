import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../@services/menu.service';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuService.quoteOpened = false;
  }

}
