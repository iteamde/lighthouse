import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopQuoteComponent } from './desktop-quote.component';

describe('DesktopQuoteComponent', () => {
  let component: DesktopQuoteComponent;
  let fixture: ComponentFixture<DesktopQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
