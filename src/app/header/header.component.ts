import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fade } from '../animations';
import { AuthService } from '../@services/auth.service';
import { ProjectService } from '../@services/project.service';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { Router } from '../../../node_modules/@angular/router';
import { MenuService } from '../@services/menu.service';
import { BreakpointService } from '../@services/breakpoint.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fade]
})
export class HeaderComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<boolean>();
  @Output()
  quoteToggle = new EventEmitter<boolean>();
  @Output()
  searchToggle = new EventEmitter<boolean>();

  // projectCartItemCount: number;
  projectId;

  searchOpen = false;

  constructor(
    public projectService: ProjectService,
    public menuService: MenuService,
    private router: Router,
    public breakpointService: BreakpointService,
    public afs: AngularFirestore,
    public auth: AuthService
  ) {
    this.router.events.subscribe(event => {
      this.searchOpen = false;
    });
  }

  ngOnInit() {}

  /////////////////////
  //   Toggle Menu   //
  /////////////////////

  toggleMenu() {
    this.menuToggle.emit(true);
  }

  //////////////////////
  //   Toggle Quote   //
  //////////////////////

  toggleQuote() {
    this.quoteToggle.emit(true);
  }

  ///////////////////////
  //   Toggle Search   //
  ///////////////////////

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
  }

  ///////////////////////
  //   Search method   //
  ///////////////////////

  search(form) {
    this.router.navigate(['/search/' + form.search]);
    console.log(form);
  }
}
