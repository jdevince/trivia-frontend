import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../shared/services/signalr.service';

@Component({
  selector: 'trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss']
})
export class TriviaComponent implements OnInit {
  
  constructor(public signalRService: SignalRService) { }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTestDataListener();
  }
}
