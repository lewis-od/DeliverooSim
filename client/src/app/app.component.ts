import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GameService} from './services/game.service';
import { } from '@types/googlemaps';
import { } from '@types/gapi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';

  constructor(private gameService: GameService) {
  }

  async ngOnInit() {
  }

  ngAfterViewInit(): void {
    // Load google maps script after view init
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCzR4NI8Bfo-Vbj_X5wOK7uBhxAyKPwtZ4'; // replace by your API key
    script.type = 'text/javascript';
    script.onload = async () => await this.initGame()
    document.body.appendChild(script);
    document.body.removeChild(script);

    // load google sign in api
    const script2 = document.createElement('script');
    script2.src = 'https://apis.google.com/js/platform.js'; // replace by your API key
    script2.type = 'text/javascript';
    script2.setAttribute('async', '');
    script2.setAttribute('defer', '');
    script2.onload = async () => await this.initGoogleSignIn()
    document.body.appendChild(script2);
    // document.body.removeChild(script);

  }

  public async initGame() {
    await this.gameService.initGame({lat: 52.954784,  lng: -1.158109});
  }

  public async initGoogleSignIn() {
    console.log('google loaded');
    this.gameService.googleSignInLoaded$.next(true);
    // gapi.load('auth2', function() {
    //   gapi.auth2.init({
    //     client_id: '765060563041-1rlmrm6i5hbhouel0bsndqdqskkrm5qf.apps.googleusercontent.com'
    //   });
    //   console.log('load');
    // });

  }
}
