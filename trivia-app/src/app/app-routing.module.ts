import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';

const appRoutes: Routes = [
  { path: 'lobby', component: LobbyComponent },
  { path: 'play', component: GameComponent },
  { path: '**', redirectTo: 'lobby' }
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