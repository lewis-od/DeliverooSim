import { Component, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';
import {GameMode} from '../enums/gamemode.enum';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  public gameModeEnum = GameMode;
  public gameMode: GameMode;
  public canCollect: boolean;
  public canDeliver: boolean;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.gameMode$.subscribe(mode => this.gameMode = mode);

    this.gameService.canCollect$.subscribe(canCollect => this.canCollect = canCollect);

    this.gameService.canDeliver$.subscribe(canDeliver => this.canDeliver = canDeliver);
  }

  public async onFindOrderClick(event: any) {
    await this.gameService.findOrder();
  }

  public async onCollectOrderClick(event: any) {
    await this.gameService.collectOrder();
  }

  public async onDeliverOrderClick(event: any) {
    await this.gameService.deliverOrder();
  }

  public async onCancelClick(event: any) {
    await this.gameService.cancelOrder();
  }

  public async onCheatClick(event: any) {
    await this.gameService.cheat();
  }

}
