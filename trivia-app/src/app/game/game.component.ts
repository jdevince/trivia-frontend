import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SignalRService } from '../shared/services/signalr.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  private dialogRef: MatDialogRef<QuestionDialogComponent>;
  private interval;
  private votedAsCorrectUsernames = [];

  public game: any = {};
  public secondsTillNextQuestion = null;
  public showVoteAsCorrect: boolean;

  public get isHost() {
    const isHost = this.hostUsername === this.signalRService.username;
    return isHost;
  }

  public get hostUsername() {
    if (this.game && this.game.players) {
      return this.game.players[0].username;
    }
  }

  public get players() {
    if (this.game && this.game.players) {
      // Sort without mutating to keep join order (for host)
      return [...this.game.players].sort((a, b) => b.score - a.score);
    }
  }

  constructor(
    public signalRService: SignalRService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.signalRService.isConnected()) {
      this.signalRService.addGameStateListener(this.onGameStateChange);
      this.signalRService.addNewQuestionListener(this.onNewQuestion);
      this.signalRService.addEndQuestionListener(this.onEndQuestion);
      this.signalRService.getCurrentGameState();
    } else {
      this.backToLobby();
    }
  }

  ngOnDestroy() {
    if (this.signalRService) {
      this.signalRService.stop();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  warnIfLeavingMidGame($event: any) {
    if (this.game.isStarted) {
      $event.returnValue = true;
    }
  }

  private onGameStateChange = (game) => {
    console.log(game);
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
    this.votedAsCorrectUsernames = [];
    this.showVoteAsCorrect = question.options === null; // Don't show for multiple choice
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

  public voteAsCorrect(username: string) {
    if (this.votedAsCorrectUsernames.indexOf(username) !== -1) {
      this.snackBar.open('You have already voted for ' + username, 'Dismiss', { duration: 3000 });
    } else {
      this.votedAsCorrectUsernames.push(username);
      this.signalRService.voteAsCorrect(username);
    }
  }

  public backToLobby() {
    this.router.navigate(['lobby']);
  }
}
