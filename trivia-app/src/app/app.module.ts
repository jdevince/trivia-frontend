import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/modules/material.module';
import { GameComponent } from './game/game.component';
import { LobbyComponent } from './lobby/lobby.component';
import { QuestionDialogComponent } from './question-dialog/question-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    GameComponent,
    QuestionDialogComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
