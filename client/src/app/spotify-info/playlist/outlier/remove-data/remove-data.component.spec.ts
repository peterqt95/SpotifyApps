import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveDataComponent } from './remove-data.component';

describe('RemoveDataComponent', () => {
  let component: RemoveDataComponent;
  let fixture: ComponentFixture<RemoveDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
