import { Component } from '@angular/core';
import { SignalRService } from '../shared/services/signalr.service';
import { HttpService } from '../shared/services/http.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Difficulty } from '../shared/models/difficulty.enum';

@Component({
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent {

  public usernameControl = new FormControl();
  public difficulty = Difficulty.Easy.toString();
  public gameCodeControl = new FormControl();

  constructor(
    private httpService: HttpService,
    private signalRService: SignalRService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  public createGame() {
    if (this.usernameControl.value) {
      this.httpService.createGame(Number(this.difficulty)).subscribe(gameCode => {
        this.joinGame(gameCode);
      });
    } else {
      this.usernameControl.markAsTouched();
      this.snackBar.open('Username is required', 'Dismiss', { duration: 3000 });
    }
  }

  public onJoinGameClick() {
    if (!this.usernameControl.value && !this.gameCodeControl.value) {
      this.usernameControl.markAsTouched();
      this.gameCodeControl.markAsTouched();
      this.snackBar.open('Username and game code are required', 'Dismiss', { duration: 3000 });
    } else if (!this.usernameControl.value) {
      this.usernameControl.markAsTouched();
      this.snackBar.open('Username is required', 'Dismiss', { duration: 3000 });
    } else if (!this.gameCodeControl.value) {
      this.gameCodeControl.markAsTouched();
      this.snackBar.open('Game code is required', 'Dismiss', { duration: 3000 });
    } else {
      this.joinGame(this.gameCodeControl.value);
    }
  }

  private joinGame(gameCode) {
    this.signalRService.joinGame(this.usernameControl.value, gameCode).subscribe(result => {
      console.log(result);
      if (result === true) {
        this.router.navigate(['play']);
      } else {
        this.snackBar.open('That game code does not exist', 'Dismiss', { duration: 3000 });
      }
    })
  }
}
