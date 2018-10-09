import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  breakpoint;

  constructor(public breakpointObserver: BreakpointObserver) {
    // Breakpoints
    this.breakpointObserver
      .observe(['(min-width: 992px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.breakpoint = 'desktop';
        } else {
          this.breakpoint = 'mobile';
        }
      });
  }
}
