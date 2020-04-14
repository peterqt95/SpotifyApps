import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponentFactoryComponent } from './Components/modal-component-factory/modal-component-factory.component';
import { ModalDirective } from './Directives/modal.directive';
import { LoaderComponent } from './Components/loader/loader.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GroupedBarChartComponent } from './Components/ngx-charts/grouped-bar-chart/grouped-bar-chart.component';

@NgModule({
  declarations: [ModalComponentFactoryComponent, ModalDirective, LoaderComponent, GroupedBarChartComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    GroupedBarChartComponent,
    NgxChartsModule,
  ],
  entryComponents: [
    ModalComponentFactoryComponent
  ]
})
export class SharedModule { }
