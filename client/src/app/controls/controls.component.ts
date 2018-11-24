import { Component, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

  public async onFindOrderClick(event: any) {
    await this.gameService.findOrder();
  }

}
