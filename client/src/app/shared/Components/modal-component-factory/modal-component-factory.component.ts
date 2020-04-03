import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild, Input, Inject } from '@angular/core';
import { ModalDirective } from '@app/shared/Directives/modal.directive';
import { ModalItem } from '@app/shared/Classes/ModalItem';
import { ModalComponent } from '@app/shared/Classes/ModalComponent';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-component-factory',
  templateUrl: './modal-component-factory.component.html',
  styleUrls: ['./modal-component-factory.component.css']
})
export class ModalComponentFactoryComponent implements OnInit, OnDestroy {

  @ViewChild(ModalDirective) modalHost: ModalDirective;
  

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public dialogRef: MatDialogRef<ModalComponentFactoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalItem
  ) { }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {

  }

  private loadComponent(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.data.component);

    const viewContainerRef = this.modalHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<ModalComponent>componentRef.instance).data = this.data.data;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
