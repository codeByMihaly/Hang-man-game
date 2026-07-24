import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameState {
  word: string;
  category: string;
  guessedLetters: string[];
  maxWrongGuesses: number;
  gameStatus: 'playing' | 'won' | 'lost';
  version: number;
}

const STORAGE_KEY = 'hangman_game_state';
const STATE_VERSION = 2;
const MAX_WRONG_GUESSES = 6;

interface WordEntry {
  word: string;
  category: string;
}

const WORD_LIST: WordEntry[] = [
  // Programming
  { word: 'ANGULAR',      category: 'Programming' },
  { word: 'COMPONENT',    category: 'Programming' },
  { word: 'SERVICE',      category: 'Programming' },
  { word: 'DIRECTIVE',    category: 'Programming' },
  { word: 'ROUTING',      category: 'Programming' },
  { word: 'OBSERVABLE',   category: 'Programming' },
  { word: 'TYPESCRIPT',   category: 'Programming' },
  { word: 'JAVASCRIPT',   category: 'Programming' },
  { word: 'INTERFACE',    category: 'Programming' },
  { word: 'DECORATOR',    category: 'Programming' },
  { word: 'TEMPLATE',     category: 'Programming' },
  { word: 'BINDING',      category: 'Programming' },
  { word: 'MODULE',       category: 'Programming' },
  { word: 'INJECTOR',     category: 'Programming' },
  { word: 'REACTIVE',     category: 'Programming' },
  // General
  { word: 'BROWSER',      category: 'Technology' },
  { word: 'FRONTEND',     category: 'Technology' },
  { word: 'DEVELOPER',    category: 'Technology' },
  { word: 'CHALLENGE',    category: 'General' },
  { word: 'KEYBOARD',     category: 'General' },
  // Bonus
  { word: 'ALGORITHM',    category: 'Programming' },
  { word: 'DEBUGGER',     category: 'Programming' },
  { word: 'COMPILER',     category: 'Programming' },
  { word: 'FRAMEWORK',    category: 'Technology' },
  { word: 'DATABASE',     category: 'Technology' },
];

function pickRandomEntry(): WordEntry {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

function isValidState(obj: unknown): obj is GameState {
  if (!obj || typeof obj !== 'object') return false;
  const s = obj as Record<string, unknown>;
  return (
    typeof s['word'] === 'string' && s['word'].length > 0 &&
    typeof s['category'] === 'string' &&
    Array.isArray(s['guessedLetters']) &&
    typeof s['maxWrongGuesses'] === 'number' &&
    (s['gameStatus'] === 'playing' || s['gameStatus'] === 'won' || s['gameStatus'] === 'lost') &&
    s['version'] === STATE_VERSION
  );
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private stateSubject = new BehaviorSubject<GameState>(this.loadOrInit());

  state$ = this.stateSubject.asObservable();

  get state(): GameState {
    return this.stateSubject.getValue();
  }

  get wrongGuessCount(): number {
    const { word, guessedLetters } = this.state;
    return guessedLetters.filter(l => !word.includes(l)).length;
  }

  get maskedWord(): string[] {
    return this.state.word.split('').map(letter =>
      this.state.guessedLetters.includes(letter) ? letter : '_'
    );
  }

  private loadOrInit(): GameState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isValidState(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore corrupt storage
    }
    return this.buildInitialState();
  }

  private buildInitialState(): GameState {
    const entry = pickRandomEntry();
    return {
      word: entry.word,
      category: entry.category,
      guessedLetters: [],
      maxWrongGuesses: MAX_WRONG_GUESSES,
      gameStatus: 'playing',
      version: STATE_VERSION
    };
  }

  private persist(state: GameState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private emit(state: GameState): void {
    this.persist(state);
    this.stateSubject.next(state);
  }

  guessLetter(letter: string): void {
    const upper = letter.toUpperCase();
    const current = this.state;

    if (current.gameStatus !== 'playing') return;
    if (current.guessedLetters.includes(upper)) return;
    if (!/^[A-Z]$/.test(upper)) return;

    const guessedLetters = [...current.guessedLetters, upper];
    const wrongCount = guessedLetters.filter(l => !current.word.includes(l)).length;

    const allRevealed = current.word.split('').every(l => guessedLetters.includes(l));
    const gameStatus =
      allRevealed ? 'won' :
      wrongCount >= current.maxWrongGuesses ? 'lost' :
      'playing';

    this.emit({ ...current, guessedLetters, gameStatus });
  }

  newGame(): void {
    const next = this.buildInitialState();
    this.emit(next);
  }

  isLetterGuessed(letter: string): boolean {
    return this.state.guessedLetters.includes(letter.toUpperCase());
  }

  isLetterWrong(letter: string): boolean {
    const upper = letter.toUpperCase();
    return this.state.guessedLetters.includes(upper) && !this.state.word.includes(upper);
  }
}
