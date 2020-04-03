import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponentFactoryComponent } from './Components/modal-component-factory/modal-component-factory.component';
import { ModalDirective } from './Directives/modal.directive';
import { LoaderComponent } from './Components/loader/loader.component';


@NgModule({
  declarations: [ModalComponentFactoryComponent, ModalDirective, LoaderComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent
  ],
  entryComponents: [
    ModalComponentFactoryComponent
  ]
})
export class SharedModule { }
