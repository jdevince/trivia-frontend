import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { TriviaComponent } from './trivia/trivia.component';

const appRoutes: Routes = [
  { path: 'trivia', component: TriviaComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}