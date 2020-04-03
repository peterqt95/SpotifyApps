import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponentFactoryComponent } from './modal-component-factory.component';

describe('ModalComponentFactoryComponent', () => {
  let component: ModalComponentFactoryComponent;
  let fixture: ComponentFixture<ModalComponentFactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponentFactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponentFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
