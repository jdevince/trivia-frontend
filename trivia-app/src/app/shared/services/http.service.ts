import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private baseURL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    public createGame(difficulty): Observable<object> {
        return this.http.post(this.baseURL + '/trivia/start-game?difficulty=' + difficulty, null);
    }
}