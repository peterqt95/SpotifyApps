import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlierMapComponent } from './outlier-map.component';

describe('OutlierMapComponent', () => {
  let component: OutlierMapComponent;
  let fixture: ComponentFixture<OutlierMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlierMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlierMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
