import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService, GameState } from '../services/game.service';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy {
  state!: GameState;
  wrongGuessCount = 0;
  maskedWord: string[] = [];
  alphabet = ALPHABET;

  wins = 0;
  losses = 0;

  private sub!: Subscription;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.sub = this.gameService.state$.subscribe(state => {
      const prev = this.state;
      this.state = state;
      this.wrongGuessCount = this.gameService.wrongGuessCount;
      this.maskedWord = this.gameService.maskedWord;

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

  /** Physical keyboard support — press a letter key to guess */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.state?.gameStatus !== 'playing') return;
    const key = event.key.toUpperCase();
    if (/^[A-Z]$/.test(key) && !this.isGuessed(key)) {
      this.gameService.guessLetter(key);
    }
  }

  onLetterClick(letter: string): void {
    this.gameService.guessLetter(letter);
  }

  newGame(): void {
    this.gameService.newGame();
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
