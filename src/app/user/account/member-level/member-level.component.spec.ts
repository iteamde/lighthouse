import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLevelComponent } from './member-level.component';

describe('MemberLevelComponent', () => {
  let component: MemberLevelComponent;
  let fixture: ComponentFixture<MemberLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
