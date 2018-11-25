import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements OnInit {

  @ViewChild('miniMap') mapRef: ElementRef;
  public miniMap: google.maps.Map;
  private currentLocationMarker: google.maps.Marker;
  private destinationMarker: google.maps.Marker;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.init$.subscribe(init => {
      if (init) {
        this.initMiniMap();
      }
    });

    this.gameService.location$.subscribe(location => {
      if (location) {
        this.updateLocation(location);
      }
    });

    this.gameService.destination$.subscribe(destination => {
      if (destination) {
        this.updateDestination(destination);
      }
    });
  }

  private initMiniMap() {
    const notts = {lat: 52.9531876, lng: -1.1492799};
    this.miniMap = new google.maps.Map(this.mapRef.nativeElement, {
      center: notts,
      zoom: 15,
      disableDefaultUI: true
    });
    this.currentLocationMarker = new google.maps.Marker({
      position: notts,
      map: this.miniMap
    });
  }

  private updateLocation(location: MapLocation) {
    this.currentLocationMarker.setPosition(location);
    // this.miniMap.setCenter(location);
    this.centreMiniMap();
  }

  private updateDestination(destination: Destination) {
    if (!this.destinationMarker) {
      this.destinationMarker = new google.maps.Marker({
        position: {lat: 52.9531876, lng: -1.1492799},
        map: this.miniMap
      });
    }
    const markerIcon = {
      url: '',
      size: new google.maps.Size(40, 40),
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 20),
    };

    if (destination.type == 'Restaurant') {
      markerIcon.url = '/assets/target.png';
      const restaurant = <Restaurant>destination.restaurant;
      console.log(restaurant.location);
      this.destinationMarker.setPosition(restaurant.location);
    } else if (destination.type == 'Residence') {
      markerIcon.url = '/assets/house.png';
      const residence = <Residence> destination.residence;
      this.destinationMarker.setPosition(residence.location);
    } else {
      console.log("Problem!!");
    }
    this.destinationMarker.setIcon(markerIcon);
    this.centreMiniMap();
  }

  private centreMiniMap() {
    if (this.destinationMarker){
      const currentLocation = this.currentLocationMarker.getPosition();
      let bounds = new google.maps.LatLngBounds(currentLocation, currentLocation);
      bounds.extend(this.destinationMarker.getPosition());
      this.miniMap.fitBounds(bounds, {bottom: 20, left: 20, right: 20, top: 20});
    }
  }

}
