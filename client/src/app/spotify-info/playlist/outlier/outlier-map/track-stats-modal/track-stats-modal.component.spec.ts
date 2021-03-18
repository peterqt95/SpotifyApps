import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackStatsModalComponent } from './track-stats-modal.component';

describe('TrackStatsModalComponent', () => {
  let component: TrackStatsModalComponent;
  let fixture: ComponentFixture<TrackStatsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackStatsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackStatsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
