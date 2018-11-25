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

  public score = this.gameService.score$;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.destination$.subscribe(destination => {
      if (destination && destination.loading) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
        this.destination = destination;
      }
    });
  }

}
