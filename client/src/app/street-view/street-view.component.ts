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

    this.streetView.addListener('position_changed', function() {
      console.log('position changed');
    });
  }

  private isWithinRange(pos1: MapLocation, pos2: MapLocation, distance: Number): boolean {
    let dLat = pos1.lat - pos2.lat;
    let dLong = pos1.long - pos2.long;

    dLat = (dLat / 90.0) * Math.PI;
    dLong = (dLong / 180.0) * Math.PI;

    let r = 6371*1000;

    let dx = r * Math.sin(dLat) * Math.cos(dLong);
    let dy = r * Math.sin(dLat) * Math.sin(dLong);

    let dr = Math.sqrt(dx*dx + dy*dy);
    if dr < distance {
      return true;
    }

    return false;
  }
}
