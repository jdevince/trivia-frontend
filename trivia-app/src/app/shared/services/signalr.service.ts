import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";

@Injectable({
    providedIn: 'root'
})
export class SignalRService {

    private hubConnection: signalR.HubConnection

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://trivia-apis.azurewebsites.net/triviaHub')
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('Connection started'))
            .catch(err => console.log('Error while starting connection: ' + err))
    }

    public addTestDataListener = () => {
        this.hubConnection.on('broadcastMessage', (data) => {
            console.log(data);
        });
    }
}