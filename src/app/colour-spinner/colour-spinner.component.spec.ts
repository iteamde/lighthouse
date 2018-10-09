import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourSpinnerComponent } from './colour-spinner.component';

describe('ColourSpinnerComponent', () => {
  let component: ColourSpinnerComponent;
  let fixture: ComponentFixture<ColourSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColourSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColourSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
