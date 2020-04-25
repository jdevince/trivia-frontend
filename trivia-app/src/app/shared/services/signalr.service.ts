import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {

    private hubConnection: signalR.HubConnection

    public joinGame(username: string, gameCode: string) {

        return new Observable<boolean>((observer) => {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(environment.apiUrl + '/triviaHub')
                .build();

            this.hubConnection
                .start()
                .then(() => {
                    console.log('Connection started')

                    this.hubConnection.invoke('joinGame', username, gameCode)
                        .then(result => {
                            console.log('Join game result:' + result);
                            observer.next(result);
                    })
                        .catch(() => {
                            console.log('Failed to join game');
                            observer.next(false);
                        })
                })
                .catch(err => {
                    console.log('Error while starting connection: ' + err)
                    observer.next(false);
                })
        });
    }

    public stop() {
        if (this.hubConnection) {
            this.hubConnection.stop();
            this.hubConnection = null;
        }
    }

    public isConnected() {
        if (this.hubConnection) {
            return true;
        } else {
            return false;
        }
    }

    //Invokes
    public startGame() {
        this.hubConnection.invoke('startGame');
    }

    public answerQuestion(answer: string) {
        this.hubConnection.invoke('answerQuestion', answer);
    }

    public getCurrentGameState() {
        this.hubConnection.invoke('getCurrentGameState');
    }

    public voteAsCorrect(username: string) {
        this.hubConnection.invoke('voteAsCorrect', username);
    }

    //Listeners
    public addGameStateListener(callback) {
        this.hubConnection.on('gameStateChange', callback);
    }

    public addNewQuestionListener(callback) {
        this.hubConnection.on('newQuestion', callback);
    }

    public addEndQuestionListener(callback) {
        this.hubConnection.on('endQuestion', callback);
    }
}