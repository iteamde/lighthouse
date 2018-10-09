import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { listStagger, fade } from '../animations';
import { Router } from '@angular/router';
import { FirestoreService } from '../@services/firestore.service';
import { MenuService } from '../@services/menu.service';
import { BreakpointService } from '../@services/breakpoint.service';

@Component({
  selector: 'desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrls: ['./desktop-nav.component.scss'],
  animations: [listStagger, fade]
})
export class DesktopNavComponent implements OnInit {
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
    public breakpointService: BreakpointService,
    public db: FirestoreService,
    public menuService: MenuService
  ) {}

  ngOnInit() {
    this.menuService.getMenu().subscribe(data => (this.menu$ = data));
  }

  toggleMenu() {
    this.menuToggle.emit(true);
    this.secondaryMenu('home');
    this.secondaryMenuLink = 'home';
    this.secondaryMenuTitle = 'home';
  }

  secondaryMenu(subMenu) {
    if (subMenu.link === this.secondaryMenuLink) {
      this.secondaryMenuLink = 'home';
      this.secondaryMenuTitle = 'home';
      return;
    }

    if (subMenu === 'home') { this.secondaryMenuTitle = 'home'; }
    else {
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
}
