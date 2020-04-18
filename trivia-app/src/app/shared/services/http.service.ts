import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private baseURL = 'http://localhost:5000'; //Todo: Move to config

    constructor(private http: HttpClient) { }

    public createGame(): Observable<object> {
        return this.http.post(this.baseURL + '/trivia/start-game', null);
    }
}