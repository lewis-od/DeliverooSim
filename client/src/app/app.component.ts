import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GameService} from './services/game.service';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';

  constructor(private gameService: GameService) {
  }

  async ngOnInit() {
  }

  ngAfterViewInit(): void {
    // Load google maps script after view init
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCzR4NI8Bfo-Vbj_X5wOK7uBhxAyKPwtZ4'; // replace by your API key
    script.type = 'text/javascript';
    script.onload = async () => await this.initGame()
    document.body.appendChild(script);
    document.body.removeChild(script);
  }

  public async initGame() {
    await this.gameService.initGame({lat: 52.954784,  lng: -1.158109});
  }
}
