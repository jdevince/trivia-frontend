import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SignalRService } from '../shared/services/signalr.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';
import { Router } from '@angular/router';

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private dialogRef: MatDialogRef<QuestionDialogComponent>;
  private interval;

  public game: any = {};
  public secondsTillNextQuestion = null;

  constructor(
    public signalRService: SignalRService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.signalRService.isConnected()) {
      this.signalRService.addGameStateListener(this.onGameStateChange);
      this.signalRService.addNewQuestionListener(this.onNewQuestion);
      this.signalRService.addEndQuestionListener(this.onEndQuestion);
      this.signalRService.getCurrentGameState();
    } else {
      this.router.navigate(['lobby']);
    }
  }

  @HostListener('window:beforeunload')
  leaveGame() {
    this.signalRService.leaveGame();
  }

  private onGameStateChange = (game) => {
    console.log(game);
    game.players = game.players.sort((a, b) => b.score - a.score);
    this.game = game;

    if (!game.isStarted) {
      this.secondsTillNextQuestion = null;
    }
  }

  public startGame() {
    this.signalRService.startGame();
  }

  private onNewQuestion = (question) => {
    console.log(question);
    this.secondsTillNextQuestion = null;
    this.openQuestionDialog(question);
  }

  private onEndQuestion = () => {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    if (this.game.isStarted) {
      this.secondsTillNextQuestion = 15;
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        if (this.secondsTillNextQuestion > 0) {
          this.secondsTillNextQuestion--;
        }
      }, 1000);
    }
  }

  openQuestionDialog(question): void {
    this.dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '90%',
      maxWidth: '500px',
      data: { question }
    });

    this.dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.signalRService.answerQuestion(response);
      }
    });
  }
}
