import { GameComponent } from 'src/app/game/game.component';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<GameComponent> {
  canDeactivate(component: GameComponent): boolean {
   
    if(component.game.isStarted){
        if (confirm("Are you sure you want to leave the game?")) {
            return true;
        } else {
            return false;
        }
    }
    return true;
  }
}