import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})
export class QuestionDialogComponent {

  public answer = '';
  public progressBarValue = 100;

  constructor(public dialogRef: MatDialogRef<QuestionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    console.log(data);

    let interval = 30000 / 1000; //Reduce 0.1 percent at a time. 30 secs / 100%
    setInterval(() => {
      this.progressBarValue = this.progressBarValue - 0.1;
    }, interval);
  }

  public submit() {
    this.dialogRef.close(this.answer);
  }
}
