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

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.gameMode$.subscribe(mode => this.gameMode = mode);
  }

  public async onFindOrderClick(event: any) {
    await this.gameService.findOrder();
  }

}
