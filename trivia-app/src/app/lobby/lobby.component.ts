import { Component } from '@angular/core';
import { SignalRService } from '../shared/services/signalr.service';
import { HttpService } from '../shared/services/http.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent {

  public username = '';
  public gameCode = '';

  constructor(
    private httpService: HttpService,
    private signalRService: SignalRService,
    private router: Router
  ) { }

  public createGame() {
    this.httpService.createGame().subscribe(gameCode => {
      this.joinGame(gameCode);
    })
  }

  public onJoinGameClick() {
    this.joinGame(this.gameCode);
  }

  private joinGame(gameCode) {
    console.log(gameCode);
    this.signalRService.joinGame(this.username, gameCode).subscribe(result => {
      if (result === true) {
        this.router.navigate(['play']);
      }
    })
  }
}
