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
  public currentDestination: Destination;

  constructor(private gameService: GameService) { }

  ngOnInit() {

    this.gameService.destination$.subscribe(destination => {
      this.setDestination(destination);
    });

    this.gameService.init$.subscribe(init => {
      if (init) {
        this.initStreetView();
      }
    });
  }

  // Set destination marker of street view
  private setDestination(destination: Destination) {
    if (!this.streetView) {
      this.initStreetView();
    }

    this.currentDestination = destination;

    if (destination.type === 'Restaurant') {
      // set marker
      console.log('adding marker');
      const restaurant = destination.restaurant;

      const restaurantMarkerIcon = {
        url: '/assets/target.png',
        size: new google.maps.Size(256, 256),
        scaledSize: new google.maps.Size(256, 256),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(128, 128),
      };

      console.log(restaurant.location.lat);
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(restaurant.location.lat, restaurant.location.long),
        //position: new google.maps.LatLng(52.9531876, -1.1492799),
        map: this.streetView,
        icon: restaurantMarkerIcon,
        // icon: 'https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|FFFF00',
        title: 'Cafe'
      });
      console.log(marker.getPosition().lng());
    }


  }

  private initStreetView() {
    console.log('init street view');
    const notts = {lat: 52.9531876, lng: -1.1492799};
    this.streetView = new google.maps.StreetViewPanorama(this.streetViewRef.nativeElement, { position: notts });

    this.streetView.addListener('position_changed', () => {
      this.handlePositionChanged();
    });
  }

  private handlePositionChanged() {

    if (!this.currentDestination) {
      return;
    }

    let destinationLocation: MapLocation;
    if (this.currentDestination.restaurant) {
      destinationLocation = this.currentDestination.restaurant.location;
    } else if (this.currentDestination.residence) {
      destinationLocation = this.currentDestination.residence.location;
    } else {
      return;
    }

    const location = <MapLocation>{
      lat: this.streetView.getPosition().lat(),
      long: this.streetView.getPosition().lng()
    };
    const inRange = this.isWithinRange(location, )
  }

  private isWithinRange(pos1: MapLocation, pos2: MapLocation, distance: number): boolean {
    return false;
  }
}
