import { Directive, Output, OnDestroy } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Directive({
  selector: '[domChange]'
})
export class DomChangeDirective implements OnDestroy {
  private changes: MutationObserver;

  @Output()
  public domChange = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    const element = this.elementRef.nativeElement;

    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) =>
        this.domChange.emit(mutation)
      );
    });

    this.changes.observe(element, {
      attributes: true,
      childList: false,
      characterData: true
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
