import { NgModule } from '@angular/core';
import { ProblemComponent } from './problem/problem.component';
import { LeetcodeProblemRoutingModule } from './leetcode-problem-routing.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [ProblemComponent],
  imports: [
    SharedModule,
    LeetcodeProblemRoutingModule
  ],
  exports: [
    ProblemComponent
  ]
})
export class LeetcodeProblemModule { }
