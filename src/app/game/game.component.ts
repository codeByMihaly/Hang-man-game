import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService, GameState, Language } from '../services/game.service';

// English QWERTY layout rows
const EN_KEYBOARD_ROWS: string[][] = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M']
];

// Hungarian keyboard layout rows (QWERTZ with accented chars)
const HU_KEYBOARD_ROWS: string[][] = [
  ['Q','W','E','R','T','Z','U','I','O','P','Ő','Ú'],
  ['A','S','D','F','G','H','J','K','L','É','Á'],
  ['Y','X','C','V','B','N','M','Í','Ö','Ü','Ó']
];

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy {
  state!: GameState;
  wrongGuessCount = 0;
  maskedWord: string[] = [];
  keyboardRows: string[][] = EN_KEYBOARD_ROWS;

  wins = 0;
  losses = 0;

  private sub!: Subscription;

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.gameService.state$.subscribe(state => {
      const prev = this.state;
      this.state = state;
      this.wrongGuessCount = this.gameService.wrongGuessCount;
      this.maskedWord = this.gameService.maskedWord;
      this.keyboardRows = state.language === 'hu' ? HU_KEYBOARD_ROWS : EN_KEYBOARD_ROWS;

      // Track score transitions
      if (prev && prev.gameStatus === 'playing') {
        if (state.gameStatus === 'won') this.wins++;
        if (state.gameStatus === 'lost') this.losses++;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get language(): Language {
    return this.state?.language ?? 'en';
  }

  get isHungarian(): boolean {
    return this.language === 'hu';
  }

  // ── Localization helpers ──────────────────────────────
  get titleLabel(): string { return 'Hangman'; }
  get subtitleLabel(): string {
    return this.isHungarian
      ? 'Találd ki a szót — kattints egy betűre vagy nyomj billentyűt!'
      : 'Guess the word — click a letter or press a key!';
  }
  get winsLabel(): string { return this.isHungarian ? 'Győzelem' : 'Wins'; }
  get lossesLabel(): string { return this.isHungarian ? 'Vereség' : 'Losses'; }
  get wonMessage(): string {
    return this.isHungarian
      ? `Nyertél! A szó: `
      : `You won! The word was `;
  }
  get lostMessage(): string {
    return this.isHungarian
      ? `Vesztettél! A szó: `
      : `Game over! The word was `;
  }
  get categoryLabel(): string { return this.isHungarian ? 'Kategória' : 'Category'; }
  get wrongLabel(): string { return this.isHungarian ? 'Hibás: ' : 'Wrong: '; }
  get attemptsLeftLabel(): string {
    const r = this.remainingGuesses;
    if (this.isHungarian) {
      return r === 1 ? `${r} lehetőség maradt` : `${r} lehetőség maradt`;
    }
    return r === 1 ? `${r} attempt left` : `${r} attempts left`;
  }
  get newGameLabel(): string { return this.isHungarian ? 'Újra' : 'New Game'; }
  get sameSettingsLabel(): string {
    return this.isHungarian ? 'Újra ezzel a beállítással' : 'Play again (same settings)';
  }
  get changeSettingsLabel(): string {
    return this.isHungarian ? 'Beállításokhoz' : 'Change settings';
  }

  /** Physical keyboard support */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.state?.gameStatus !== 'playing') return;
    const key = event.key.toUpperCase();
    // Accept standard Latin letters and Hungarian accented chars
    if (/^[A-ZÁÉÍÓÖŐÚÜŰ]$/u.test(key) && !this.isGuessed(key)) {
      this.gameService.guessLetter(key);
    }
  }

  onLetterClick(letter: string): void {
    this.gameService.guessLetter(letter);
  }

  /** New game with same settings */
  newGame(): void {
    this.gameService.newGame();
  }

  /** Go to settings screen */
  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  isGuessed(letter: string): boolean {
    return this.gameService.isLetterGuessed(letter);
  }

  isWrong(letter: string): boolean {
    return this.gameService.isLetterWrong(letter);
  }

  get remainingGuesses(): number {
    return (this.state?.maxWrongGuesses ?? 6) - this.wrongGuessCount;
  }

  get wrongLetters(): string[] {
    return this.state?.guessedLetters.filter(l => this.isWrong(l)) ?? [];
  }
}
