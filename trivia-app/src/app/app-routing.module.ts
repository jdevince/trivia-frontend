import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';
import { CanDeactivateGuard } from './shared/guards/canDeactivate.guard';

const appRoutes: Routes = [
  { path: 'lobby', component: LobbyComponent },
  { path: 'play', component: GameComponent, canDeactivate: [CanDeactivateGuard] },
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