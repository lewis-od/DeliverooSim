import { Component, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.css']
})
export class LocationInfoComponent implements OnInit {

  public destination: Destination;
  public isLoading = false;
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.destination$.subscribe(destination => {
      if (destination && Object.keys(destination).length === 0) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
        this.destination = destination;
      }
    });
  }

}
