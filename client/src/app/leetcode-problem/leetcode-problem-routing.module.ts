import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProblemComponent } from './problem/problem.component';
import { AuthGuard } from '@app/auth.guard';

const routes: Routes = [
  { path: 'problem/:id', component: ProblemComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeetcodeProblemRoutingModule { }
