import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StreetViewComponent } from './street-view/street-view.component';
import {HttpClientModule} from '@angular/common/http';
import { GameComponent } from './game/game.component';
import { ControlsComponent } from './controls/controls.component';
import { LocationInfoComponent } from './location-info/location-info.component';
import { MiniMapComponent } from './mini-map/mini-map.component';
import { GoogleSignInComponent } from './google-sign-in/google-sign-in.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';

@NgModule({
  declarations: [
    AppComponent,
    StreetViewComponent,
    GameComponent,
    ControlsComponent,
    LocationInfoComponent,
    MiniMapComponent,
    GoogleSignInComponent,
    ScoreboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
