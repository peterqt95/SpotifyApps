import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableDisplayComponent } from './mat-table-display.component';

describe('MatTableDisplayComponent', () => {
  let component: MatTableDisplayComponent;
  let fixture: ComponentFixture<MatTableDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatTableDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTableDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
