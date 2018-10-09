import { Component, OnInit } from '@angular/core';
import { MenuService } from '../@services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slideConfig = {
    autoplay: true,
    autoplaySpeed: 5000,

    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,

    dots: true,
    prevArrow: false,
    nextArrow: false
  };

  constructor(public menuService: MenuService) {}

  ngOnInit() {
    this.menuService.quoteOpened = false;
  }

  slickInit(e) {}

  breakpoint(e) {
    console.log('breakpoint');
  }
}
