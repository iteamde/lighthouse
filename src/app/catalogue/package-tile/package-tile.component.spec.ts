import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTileComponent } from './package-tile.component';

describe('PackageTileComponent', () => {
  let component: PackageTileComponent;
  let fixture: ComponentFixture<PackageTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
