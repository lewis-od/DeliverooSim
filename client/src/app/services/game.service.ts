import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {ApiService} from './api.service';
import {GameMode} from '../enums/gamemode.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public seedLocation: MapLocation;

  // Observables
  public destination$ = new BehaviorSubject<Destination>(null);
  public gameMode$ = new BehaviorSubject<GameMode>(GameMode.NONE);
  public init$ = new BehaviorSubject<boolean>(false);
  public canCollect$ = new BehaviorSubject<boolean>(false);
  public canDeliver$ = new BehaviorSubject<boolean>(false);
  public location$ = new BehaviorSubject<MapLocation>(null);
  public score$ = new BehaviorSubject<number>(0);
  public googleSignInLoaded$ = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) {

  }

  public async initGame(seed: MapLocation) {
    this.seedLocation = seed;
    this.init$.next(true);
  }

  public async findOrder() {
    console.log('find order');
    this.gameMode$.next(GameMode.PICKUP);
    this.destination$.next(<Destination>{loading: true});
    const restaurant = await this.apiService.getRestaurant(this.seedLocation);
    const destination = <Destination> {
      type: 'Restaurant',
      restaurant: restaurant
    }
    console.log('next destination');
    this.destination$.next(destination);
  }

  public async collectOrder() {
    console.log('collect order');
    this.gameMode$.next(GameMode.DELIVER);
    // get residence
    // const residence = <Residence>{
    //   address: '82 Middleton Blvd, Nottingham NG8 1AA, UK',
    //   location: <MapLocation> {
    //     lat: 52.9533602,
    //     lng: -1.1895487
    //   }
    // };
    const restaurantLocation = this.destination$.getValue().restaurant.location;
    const residence = await this.apiService.getResidence(restaurantLocation);
    const destination = <Destination>{
      type: 'Residence',
      residence: residence
    }
    this.destination$.next(destination);
  }

  public async deliverOrder() {
    console.log('deliver order');
    this.gameMode$.next(GameMode.NONE);
    this.destination$.next(<Destination>{ });
    const score = this.score$.getValue() + 1;
    this.score$.next(score);
  }

  public updateLocation(location: MapLocation) {
    this.location$.next(location);
  }
}
