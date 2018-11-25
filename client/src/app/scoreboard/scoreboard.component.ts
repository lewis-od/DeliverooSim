import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  scores: User[];

  constructor(private apiService: ApiService) { }

  async ngOnInit() {
    this.scores = await this.apiService.getLeaderboard();


  }

}
