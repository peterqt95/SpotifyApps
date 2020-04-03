import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlierModalComponent } from './outlier-modal.component';

describe('OutlierModalComponent', () => {
  let component: OutlierModalComponent;
  let fixture: ComponentFixture<OutlierModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlierModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
