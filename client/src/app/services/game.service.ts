import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {ApiService} from './api.service';
import {GameMode} from '../enums/gamemode.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public seedLocation: MapLocation;

  // Observables
  public destination$ = new Subject<Destination>();
  public gameMode$ = new BehaviorSubject<GameMode>(null);

  constructor(private apiService: ApiService) {

  }

  public async initGame(seed: MapLocation) {
    this.seedLocation = seed;
    console.log('gm:');
    console.log('gm:' + GameMode.PICKUP);
    this.gameMode$.next(GameMode.PICKUP);

    const restaurant = await this.apiService.getRestaurant(seed);
    this.destination$.next(restaurant);
  }
}
