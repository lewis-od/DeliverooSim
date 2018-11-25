import { Component, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.css']
})
export class GoogleSignInComponent implements OnInit {

  public signedInAs: string = null;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.googleSignInLoaded$.subscribe(loaded => {
      if (loaded) {
        this.renderButton();
      }
    });

  }

  public onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    console.log('signed in');
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    this.signedInAs = profile.getEmail();
  }
  public onFailure(error) {
    console.log(error);
  }
  public renderButton() {
    (<any>gapi).signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': (googleUser) => this.onSuccess(googleUser),
      'onfailure': this.onFailure
    });
  }

}
