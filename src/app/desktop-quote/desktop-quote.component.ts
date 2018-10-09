import { Component, OnInit, HostListener } from '@angular/core';
import { ProjectService } from '../@services/project.service';
import { MenuService } from '../@services/menu.service';
import { AuthService } from '../@services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { QuoteService } from '../@services/quote.service';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'desktop-quote',
  templateUrl: './desktop-quote.component.html',
  styleUrls: ['./desktop-quote.component.scss']
})
export class DesktopQuoteComponent implements OnInit {
  a = 0;
  opened = false;
  breakpoint;
  viewHeight: number;
  windowHeight;

  @ViewChild('desktopQuote')
  elementView: ElementRef;
  quoteLargerThanWindow: boolean;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowHeight = window.innerHeight;
  }

  constructor(
    public quoteService: QuoteService,
    public projectService: ProjectService,
    public breakpointObserver: BreakpointObserver,
    public menuService: MenuService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    // Breakpoints

    this.windowHeight = window.innerHeight;
    this.breakpointObserver
      .observe(['(min-width: 1420px)'])
      .subscribe((state: BreakpointState) => {

        if (state.matches) {
          this.menuService.quoteOpened = true;
          this.breakpoint = 'xxl';
        } else {
          this.menuService.quoteOpened = false;
          this.breakpoint = 'small';
        }
        console.log(this.breakpoint);
    
      });

    this.projectService.quoteUpdated.subscribe(data => {
      this.height();
    });

  }


  toggleQuote() {
    if (this.breakpoint === 'small' || this.quoteService.permanentlyOpen === false) {
      this.menuService.quoteOpened = !this.menuService.quoteOpened;
    }
  }

  height() {
    this.viewHeight = this.elementView.nativeElement.offsetHeight;

    if (this.windowHeight - this.viewHeight < 100) {
      this.viewHeight = this.viewHeight - this.viewHeight * 2; // Negate the pixel value
      this.quoteLargerThanWindow = true;
    } else {
      this.viewHeight = null;
      this.quoteLargerThanWindow = false;
    }
  }

  bottomQuoteStyle() {
    if (this.menuService.quoteOpened) { return this.viewHeight; }
  }

  onDomChange(event) {
    this.height();
    console.log(event);
  }
}
