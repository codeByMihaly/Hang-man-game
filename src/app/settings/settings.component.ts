import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService, Language } from '../services/game.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  constructor(private router: Router, private gameService: GameService) {}

  selectLanguage(lang: Language): void {
    this.gameService.setSettings({
      language: lang,
      difficulty: this.gameService.settings.difficulty
    });
    this.router.navigate(['/difficulty']);
  }
}
