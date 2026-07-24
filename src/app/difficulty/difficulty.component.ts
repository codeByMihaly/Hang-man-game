import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService, Language, Difficulty, DIFFICULTY_MAX_WRONG } from '../services/game.service';

interface DifficultyOption {
  key: Difficulty;
  labelEn: string;
  labelHu: string;
  descEn: string;
  descHu: string;
  maxWrong: number;
  color: string;
}

@Component({
  selector: 'app-difficulty',
  templateUrl: './difficulty.component.html',
  styleUrl: './difficulty.component.scss'
})
export class DifficultyComponent {
  language: Language = 'en';

  difficulties: DifficultyOption[] = [
    {
      key: 'easy',
      labelEn: 'Easy',
      labelHu: 'Könnyű',
      descEn: 'Everyday words • 10 mistakes allowed',
      descHu: 'Mindennapos szavak • 10 hibázás',
      maxWrong: DIFFICULTY_MAX_WRONG['easy'],
      color: '#2ecc71'
    },
    {
      key: 'medium',
      labelEn: 'Medium',
      labelHu: 'Közepes',
      descEn: 'Less common words • 8 mistakes allowed',
      descHu: 'Kevésbé hétköznapi szavak • 8 hibázás',
      maxWrong: DIFFICULTY_MAX_WRONG['medium'],
      color: '#f39c12'
    },
    {
      key: 'hard',
      labelEn: 'Hard',
      labelHu: 'Nehéz',
      descEn: 'Uncommon words • 6 mistakes allowed',
      descHu: 'Szokatlan szavak • 6 hibázás',
      maxWrong: DIFFICULTY_MAX_WRONG['hard'],
      color: '#e67e22'
    },
    {
      key: 'extreme',
      labelEn: 'Extreme',
      labelHu: 'Extreme',
      descEn: 'Very rare words • only 3 mistakes allowed',
      descHu: 'Nagyon ritka szavak • csak 3 hibázás',
      maxWrong: DIFFICULTY_MAX_WRONG['extreme'],
      color: '#e74c3c'
    }
  ];

  constructor(private router: Router, private gameService: GameService) {
    this.language = this.gameService.settings.language;
    // If no language set yet, go to settings
    if (!this.language) {
      this.router.navigate(['/settings']);
    }
  }

  get isHungarian(): boolean {
    return this.language === 'hu';
  }

  get backLabel(): string {
    return this.isHungarian ? 'Vissza' : 'Back';
  }

  get titleLabel(): string {
    return this.isHungarian ? 'Válassz nehézséget' : 'Select Difficulty';
  }

  selectDifficulty(diff: Difficulty): void {
    this.gameService.setSettings({
      language: this.language,
      difficulty: diff
    });
    // Force a new game with these settings
    this.gameService.newGameWithSettings({
      language: this.language,
      difficulty: diff
    });
    this.router.navigate(['/game']);
  }

  goBack(): void {
    this.router.navigate(['/settings']);
  }
}
