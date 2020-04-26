import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {

    private hubConnection: signalR.HubConnection
    private retryConnectCount = 0;

    public username: string;

    public joinGame(username: string, gameCode: string) {
        return new Observable<string>((observer) => { this.attemptJoinGame(observer, username, gameCode) });
    }

    private attemptJoinGame(observer, username, gameCode) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.apiUrl + '/triviaHub')
            .build();

        this.hubConnection
            .start()
            .then(() => {
                this.hubConnection.invoke('joinGame', username, gameCode)
                    .then(result => {
                        if (result === false) {
                            // Sometimes this is failing to hit the endpoint and just returning false. Let's retry up to 5 times.
                            console.log('Failed to join game, but retrying');
                            if (this.retryConnectCount < 5) {
                                this.retryConnectCount++;
                                this.attemptJoinGame(observer, username, gameCode);
                            } else {
                                observer.next('Failed to connect and hit max retry count');
                            }
                        } else {
                            this.username = username;
                            observer.next(result);
                        }
                    })
                    .catch(err => {
                        observer.next('Error while joining game: ' + err);
                    })
            })
            .catch(err => {
                observer.next('Error while starting connection: ' + err);
            })
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