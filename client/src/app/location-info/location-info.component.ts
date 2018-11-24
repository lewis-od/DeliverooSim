import { Component, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.css']
})
export class LocationInfoComponent implements OnInit {

  public destination: Destination;
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.destination$.subscribe(destination => {
      this.destination = destination;
    })
  }

}
