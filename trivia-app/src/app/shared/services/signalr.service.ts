import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {

    private hubConnection: signalR.HubConnection

    public joinGame(username: string, gameCode: string) {

        return new Observable<boolean>((observer) => {
            this.hubConnection = new signalR.HubConnectionBuilder()
                //.withUrl('https://trivia-apis.azurewebsites.net/triviaHub')
                .withUrl('http://localhost:5000/triviaHub')
                .build();

            this.hubConnection
                .start()
                .then(() => {
                    console.log('Connection started')

                    this.hubConnection.invoke('joinGame', username, gameCode)
                        .then(() => {
                            console.log('Joined game');
                            observer.next(true);
                    })
                        .catch(() => {
                            console.log('Failed to join game');
                            observer.error('Failed to join game');
                        })
                })
                .catch(err => {
                    console.log('Error while starting connection: ' + err)
                    observer.error('Error while starting connection: ' + err);
                })
        });
    }

    //Invokes
    public startGame() {
        this.hubConnection.invoke('startGame');
    }

    public answerQuestion(answer: string) {
        console.log('Ans ' + answer);
        this.hubConnection.invoke('answerQuestion', answer);
    }

    public updateGameState() {
        this.hubConnection.invoke('updateGameState');
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