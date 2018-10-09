import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsthisyouComponent } from './isthisyou.component';

describe('IsthisyouComponent', () => {
  let component: IsthisyouComponent;
  let fixture: ComponentFixture<IsthisyouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsthisyouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsthisyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
