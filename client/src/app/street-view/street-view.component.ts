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

  private WITHIN_RANGE = 200;
  public withinRangeOfCollection = false;
  public withinRangeOfDelivery = false;
  public marker: any;

  constructor(private gameService: GameService) { }

  ngOnInit() {

    this.gameService.destination$.subscribe(destination => {
      if (destination) {
        this.setDestination(destination);
      }
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
    this.clearMarker();

    if (destination.type === 'Restaurant') {
      // set marker
      console.log('adding destination marker');
      const restaurant = destination.restaurant;

      const restaurantMarkerIcon = {
        url: '/assets/target.png',
        size: new google.maps.Size(256, 256),
        scaledSize: new google.maps.Size(256, 256),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(128, 128),
      };

      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(restaurant.location.lat, restaurant.location.lng),
        map: this.streetView,
        icon: restaurantMarkerIcon,
      });
      this.streetView.setPosition(new google.maps.LatLng(restaurant.location.lat, restaurant.location.lng));
    } else if (destination.type === 'Residence') {
      console.log('adding residence marker');

      const residence = destination.residence;
      const residenceMarkerIcon = {
        url: '/assets/house.png',
        size: new google.maps.Size(256, 256),
        scaledSize: new google.maps.Size(256, 256),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(128, 128),
      };

      console.log(residence);
      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(residence.location.lat, residence.location.lng),
        //position: new google.maps.LatLng(52.9531876, -1.1492799),
        map: this.streetView,
        icon: residenceMarkerIcon,
      });

      this.streetView.setPosition(new google.maps.LatLng(residence.location.lat, residence.location.lng));
    }
  }

  private clearMarker() {
    if (this.marker) {
      this.marker.setMap(null);
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

    const location = <MapLocation>{
      lat: this.streetView.getPosition().lat(),
      lng: this.streetView.getPosition().lng()
    };

    this.gameService.updateLocation(location);
    if (!this.currentDestination) {
      return;
    }

    let destinationLocation: MapLocation;
    if (this.currentDestination.restaurant) {
      destinationLocation = this.currentDestination.restaurant.location;
      this.withinRangeOfCollection = this.isWithinRange(location, destinationLocation, this.WITHIN_RANGE);
      this.gameService.canCollect$.next(this.withinRangeOfCollection);
    } else if (this.currentDestination.residence) {
      console.log('residence: pos changed');
      destinationLocation = this.currentDestination.residence.location;
      console.log(destinationLocation);
      this.withinRangeOfDelivery = this.isWithinRange(location, destinationLocation, this.WITHIN_RANGE);
      this.gameService.canDeliver$.next(this.withinRangeOfDelivery);
    } else {
      return;
    }
  }

  private isWithinRange(pos1: MapLocation, pos2: MapLocation, distance: number): boolean {
    let dLat = pos1.lat - pos2.lat;
    let dLong = pos1.lng - pos2.lng;

    dLat = (dLat / 90.0) * Math.PI;
    dLong = (dLong / 180.0) * Math.PI;

    const r = 6371 * 1000;

    const dx = r * Math.sin(dLat) * Math.cos(dLong);
    const dy = r * Math.sin(dLat) * Math.sin(dLong);

    const dr = Math.sqrt(dx * dx + dy * dy);
    if (dr < distance) {
      return true;
    }
    return false;
  }
}
