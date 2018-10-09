import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../@services/auth.service';
import { MenuService } from '../../../@services/menu.service';

@Component({
  selector: 'member-level',
  templateUrl: './member-level.component.html',
  styleUrls: ['./member-level.component.scss']
})
export class MemberLevelComponent implements OnInit, OnDestroy {
  points;
  level;
  discountPercent;
  name;

  userInfo;

  constructor(private menuService: MenuService, public auth: AuthService) {}

  ngOnDestroy() {
    this.menuService.invert = false;
  }

  ngOnInit() {
    console.log(this.level);
    this.menuService.invert = true;
    this.calculateMemberLevel(this.auth.userDetails);
  }

  calculateMemberLevel(data) {
    if (data.membershipLevel === 1) {
      this.level = 1;
      this.discountPercent = 5;
      this.name = 'Blue member';
    }

    if (data.membershipLevel === 2) {
      this.level = 2;
      this.discountPercent = 10;
      this.name = 'Silver member';
    }

    if (data.membershipLevel === 3) {
      this.level = 3;
      this.discountPercent = 20;
      this.name = 'Gold member';
    }

    if (data.membershipLevel === 4) {
      this.level = 4;
      this.discountPercent = 30;
      this.name = 'Platinum member';
    }

    if (data.membershipLevel === 5) {
      this.level = 5;
      this.discountPercent = 20;
      this.name = 'St Kilda Film Festival Promo';
    }

    if (data.membershipLevel === 6) {
      this.level = 6;
      this.discountPercent = 40;
      this.name = 'Student member';
    }

    if (data.membershipLevel === 7) {
      this.level = 7;
      this.discountPercent = 20;
      this.name = 'Melbourne Web Fest 2018';
    }
  }
}
