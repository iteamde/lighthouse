import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { listStagger } from '../animations';
import { Router } from '@angular/router';
import { FirestoreService } from '../@services/firestore.service';
import { MenuService } from '../@services/menu.service';

@Component({
  selector: 'mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  animations: [listStagger]
})
export class MobileMenuComponent implements OnInit {
  secondaryMenuLink: string;
  secondaryMenuTitle = 'home';
  secondaryMenuOrder: number;
  menu$: any = [];
  subMenu$;
  subMenuActive;

  @Output()
  menuToggle = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    public db: FirestoreService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.menuService.getMenu().subscribe(data => (this.menu$ = data));
  }

  toggleMenu() {
    this.menuToggle.emit(true);
    this.secondaryMenu('home');
  }

  secondaryMenu(subMenu) {
    if (subMenu === 'home') {
      this.secondaryMenuTitle = 'home';
    } else {
      this.secondaryMenuLink = subMenu.link;
      this.secondaryMenuTitle = subMenu.name;
      this.secondaryMenuOrder = subMenu.order;
      if (subMenu.link === 'vehicles') {
        this.toggleMenu();
        this.router.navigate(['catalogue/vehicles']);
      }
    }
  }

  navigateTo(menu) {
    this.router.navigate([menu]);
  }

  onKey(event) {
    console.log(event);
  }
}
