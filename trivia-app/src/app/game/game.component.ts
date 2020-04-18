import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../shared/services/signalr.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private dialogRef: MatDialogRef<QuestionDialogComponent>;

  public game: any = {};

  constructor(
    public signalRService: SignalRService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.signalRService.addGameStateListener(this.onGameStateChange);
    this.signalRService.addNewQuestionListener(this.onNewQuestion);
    this.signalRService.addEndQuestionListener(this.onEndQuestion);
    this.signalRService.updateGameState();
  }

  private onGameStateChange = (game) => {
    console.log(game);
    this.game = game;
  }

  public startGame() {
    this.signalRService.startGame();
  }

  private onNewQuestion = (data) => {
    console.log(data);
    this.openQuestionDialog(data);
  }

  private onEndQuestion = (answer) => {
    this.dialogRef.close();
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
