import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
// @ts-ignore
import {   } from '@types/googlemaps';
import {Subscription} from 'rxjs';
import {GameService} from '../services/game.service';

/// <reference path="./../../../typings/globals/google.maps/index.d.ts" />

@Component({
  selector: 'app-street-view',
  templateUrl: './street-view.component.html',
  styleUrls: ['./street-view.component.scss']
})
export class StreetViewComponent implements OnInit {

  @ViewChild('streetView') streetViewRef: ElementRef;
  public streetView: google.maps.StreetViewPanorama;


  private destinationSubscription: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit() {

    this.destinationSubscription = this.gameService.destination$.subscribe(destination => this.setDestination(destination));
  }

  public setLocation(lat: number, long: number) {
    console.log('set location');
  }

  // Set destination marker of street view
  private setDestination(destination: Destination) {
    if (!this.streetView) {
      this.initStreetView();
    }

    // set marker
    console.log('adding marker');


    const restaurantMarkerIcon = {
      url: '/assets/target.png',
      size: new google.maps.Size(256, 256),
      scaledSize: new google.maps.Size(256, 256),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(128, 128),
    };

    const marker = new google.maps.Marker({
      position: {lat: destination.location.lat, lng: destination.location.lng},
      map: this.streetView,
      icon: restaurantMarkerIcon
    });
  }

  private initStreetView() {
    console.log('init street view');
    const notts = {lat: 52.9533602, lng: -1.1895487};
    this.streetView = new google.maps.StreetViewPanorama(this.streetViewRef.nativeElement, { position: notts });
  }

}
