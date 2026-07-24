import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'hu';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface GameSettings {
  language: Language;
  difficulty: Difficulty;
}

export interface GameState {
  word: string;
  category: string;
  guessedLetters: string[];
  maxWrongGuesses: number;
  gameStatus: 'playing' | 'won' | 'lost';
  language: Language;
  difficulty: Difficulty;
  version: number;
}

const STORAGE_KEY = 'hangman_game_state';
const SETTINGS_KEY = 'hangman_game_settings';
const STATE_VERSION = 3;

// Difficulty -> max wrong guesses
// Easy: 10, Medium: 8, Hard: 6, Extreme: 3
export const DIFFICULTY_MAX_WRONG: Record<Difficulty, number> = {
  easy: 10,
  medium: 8,
  hard: 6,
  extreme: 3
};

interface WordEntry {
  word: string;
  category: string;
}

// ─── ENGLISH WORD LISTS ───────────────────────────────────────────────
// Easy: everyday common words
const EN_EASY: WordEntry[] = [
  { word: 'APPLE', category: 'Food' },
  { word: 'BREAD', category: 'Food' },
  { word: 'WATER', category: 'Drinks' },
  { word: 'HOUSE', category: 'Places' },
  { word: 'TABLE', category: 'Furniture' },
  { word: 'CHAIR', category: 'Furniture' },
  { word: 'PHONE', category: 'Technology' },
  { word: 'CLOCK', category: 'Objects' },
  { word: 'MUSIC', category: 'Arts' },
  { word: 'LIGHT', category: 'Objects' },
  { word: 'MONEY', category: 'Finance' },
  { word: 'PLANT', category: 'Nature' },
  { word: 'SHIRT', category: 'Clothing' },
  { word: 'SHOES', category: 'Clothing' },
  { word: 'TRAIN', category: 'Transport' },
  { word: 'BEACH', category: 'Places' },
  { word: 'CLOUD', category: 'Nature' },
  { word: 'STORM', category: 'Nature' },
  { word: 'CANDY', category: 'Food' },
  { word: 'RIVER', category: 'Nature' },
  { word: 'MOUSE', category: 'Animals' },
  { word: 'TIGER', category: 'Animals' },
  { word: 'HORSE', category: 'Animals' },
  { word: 'PIZZA', category: 'Food' },
  { word: 'NIGHT', category: 'Time' },
];

// Medium: less common but known words
const EN_MEDIUM: WordEntry[] = [
  { word: 'JUNGLE', category: 'Nature' },
  { word: 'CASTLE', category: 'Places' },
  { word: 'BRIDGE', category: 'Architecture' },
  { word: 'PLANET', category: 'Science' },
  { word: 'KNIGHT', category: 'History' },
  { word: 'MAGNET', category: 'Science' },
  { word: 'PILLOW', category: 'Objects' },
  { word: 'VOYAGE', category: 'Travel' },
  { word: 'SILVER', category: 'Materials' },
  { word: 'FALCON', category: 'Animals' },
  { word: 'MARBLE', category: 'Materials' },
  { word: 'ANCHOR', category: 'Nautical' },
  { word: 'DRAGON', category: 'Mythology' },
  { word: 'SUNSET', category: 'Nature' },
  { word: 'FOREST', category: 'Nature' },
  { word: 'TICKET', category: 'Objects' },
  { word: 'BUTTER', category: 'Food' },
  { word: 'CAMERA', category: 'Technology' },
  { word: 'TROPHY', category: 'Sports' },
  { word: 'CANDLE', category: 'Objects' },
  { word: 'TUNNEL', category: 'Architecture' },
  { word: 'FOSSIL', category: 'Science' },
  { word: 'MIRROR', category: 'Objects' },
  { word: 'BASKET', category: 'Objects' },
  { word: 'VALLEY', category: 'Nature' },
];

// Hard: uncommon, technical, or complex words
const EN_HARD: WordEntry[] = [
  { word: 'ANGULAR', category: 'Programming' },
  { word: 'COMPONENT', category: 'Programming' },
  { word: 'ALGORITHM', category: 'Programming' },
  { word: 'TYPESCRIPT', category: 'Programming' },
  { word: 'JAVASCRIPT', category: 'Programming' },
  { word: 'INTERFACE', category: 'Programming' },
  { word: 'OBSERVABLE', category: 'Programming' },
  { word: 'DECORATOR', category: 'Programming' },
  { word: 'TEMPLATE', category: 'Programming' },
  { word: 'FRAMEWORK', category: 'Technology' },
  { word: 'DATABASE', category: 'Technology' },
  { word: 'COMPILER', category: 'Technology' },
  { word: 'DEBUGGER', category: 'Technology' },
  { word: 'REACTIVE', category: 'Programming' },
  { word: 'ELOQUENT', category: 'Language' },
  { word: 'AMBIGUOUS', category: 'Language' },
  { word: 'LABYRINTH', category: 'Places' },
  { word: 'CATHEDRAL', category: 'Architecture' },
  { word: 'METAMORPH', category: 'Science' },
  { word: 'SOVEREIGN', category: 'Politics' },
  { word: 'PENINSULA', category: 'Geography' },
  { word: 'ADVERSARY', category: 'General' },
  { word: 'MAGNITUDE', category: 'Science' },
  { word: 'CELESTIAL', category: 'Astronomy' },
  { word: 'CHRONICLE', category: 'History' },
];

// Extreme: very difficult, unusual or long words
const EN_EXTREME: WordEntry[] = [
  { word: 'JUXTAPOSITION', category: 'Language' },
  { word: 'ONOMATOPOEIA', category: 'Language' },
  { word: 'METAMORPHOSIS', category: 'Science' },
  { word: 'BUREAUCRACY', category: 'Politics' },
  { word: 'QUARANTINE', category: 'Medicine' },
  { word: 'SUBJECTIVITY', category: 'Philosophy' },
  { word: 'PHOTOSYNTHESIS', category: 'Biology' },
  { word: 'QUINTESSENTIAL', category: 'Language' },
  { word: 'ANTHROPOLOGY', category: 'Science' },
  { word: 'KALEIDOSCOPE', category: 'Objects' },
  { word: 'EXTRAORDINARY', category: 'General' },
  { word: 'CRYPTOGRAPHY', category: 'Technology' },
  { word: 'FLAMBOYANT', category: 'Language' },
  { word: 'AMBIVALENCE', category: 'Psychology' },
  { word: 'CACOPHONY', category: 'Music' },
  { word: 'HYPOCHONDRIAC', category: 'Medicine' },
  { word: 'PHILANTHROPY', category: 'Social' },
  { word: 'CATASTROPHE', category: 'General' },
  { word: 'DISCOMBOBULATE', category: 'Language' },
  { word: 'PERSPICACIOUS', category: 'Language' },
];

// ─── HUNGARIAN WORD LISTS ─────────────────────────────────────────────
// Easy: mindennapi közismert szavak
const HU_EASY: WordEntry[] = [
  { word: 'ALMA', category: 'Étel' },
  { word: 'KENYÉR', category: 'Étel' },
  { word: 'DINNYE', category: 'Gyümölcs' },
  { word: 'ASZTAL', category: 'Bútor' },
  { word: 'SZÉK', category: 'Bútor' },
  { word: 'TELEFON', category: 'Technika' },
  { word: 'ABLAK', category: 'Épület' },
  { word: 'KUTYA', category: 'Állatok' },
  { word: 'MACSKA', category: 'Állatok' },
  { word: 'BARÁT', category: 'Emberek' },
  { word: 'ZENE', category: 'Kultúra' },
  { word: 'VIRÁG', category: 'Természet' },
  { word: 'ŐSZI', category: 'Évszak' },
  { word: 'NYÁR', category: 'Évszak' },
  { word: 'VONAT', category: 'Közlekedés' },
  { word: 'AUTÓ', category: 'Közlekedés' },
  { word: 'CIPŐ', category: 'Ruházat' },
  { word: 'KÖNYV', category: 'Tárgyak' },
  { word: 'PIZZA', category: 'Étel' },
  { word: 'TORTA', category: 'Étel' },
  { word: 'BARACK', category: 'Gyümölcs' },
  { word: 'NARANCS', category: 'Gyümölcs' },
  { word: 'ERDŐ', category: 'Természet' },
  { word: 'FOLYÓ', category: 'Természet' },
  { word: 'KERT', category: 'Természet' },
];

// Medium: közepes ismertségű szavak
const HU_MEDIUM: WordEntry[] = [
  { word: 'VÁSÁR', category: 'Üzlet' },
  { word: 'ÜNNEP', category: 'Kultúra' },
  { word: 'KIRÁNDULÁS', category: 'Szabadidő' },
  { word: 'FELHŐ', category: 'Természet' },
  { word: 'TENGER', category: 'Természet' },
  { word: 'KASTÉLY', category: 'Épületek' },
  { word: 'MÉRLEG', category: 'Eszközök' },
  { word: 'TÜKÖR', category: 'Tárgyak' },
  { word: 'KOVÁCS', category: 'Mesterségek' },
  { word: 'DOMBOS', category: 'Természet' },
  { word: 'TANÁR', category: 'Foglalkozások' },
  { word: 'ORVOS', category: 'Foglalkozások' },
  { word: 'MÉRNÖK', category: 'Foglalkozások' },
  { word: 'PILÓTA', category: 'Foglalkozások' },
  { word: 'CSILLAG', category: 'Asztronómia' },
  { word: 'BOLYGÓ', category: 'Asztronómia' },
  { word: 'FOLYAMAT', category: 'Általános' },
  { word: 'VILLÁMOS', category: 'Közlekedés' },
  { word: 'KESZTYŰ', category: 'Ruházat' },
  { word: 'ÖRÖKLÉT', category: 'Fogalmak' },
  { word: 'SZIKLA', category: 'Természet' },
  { word: 'HATÁR', category: 'Földrajz' },
  { word: 'GÖRÖGDINNYE', category: 'Gyümölcs' },
  { word: 'KÉZFOGÁS', category: 'Gesztus' },
  { word: 'NYAKLÁZ', category: 'Betegség' },
];

// Hard: nehezebb, kevésbé hétköznapi szavak
const HU_HARD: WordEntry[] = [
  { word: 'KÖRVONALAZÁS', category: 'Fogalmak' },
  { word: 'FOGLALATOSSÁG', category: 'Fogalmak' },
  { word: 'HULLÁMHOSSZ', category: 'Fizika' },
  { word: 'ÖSSZEFÜGGÉS', category: 'Tudományok' },
  { word: 'GYÜLEKEZET', category: 'Vallás' },
  { word: 'LENDÜLET', category: 'Fizika' },
  { word: 'FELSZABADULÁS', category: 'Történelem' },
  { word: 'KISZOLGÁLTATOTTSÁG', category: 'Pszichológia' },
  { word: 'ÖNKORMÁNYZAT', category: 'Politika' },
  { word: 'BELGYÓGYÁSZAT', category: 'Orvostudomány' },
  { word: 'ÉPÜLETSZERKEZET', category: 'Építészet' },
  { word: 'TERMÉSZETVÉDELEM', category: 'Környezet' },
  { word: 'CSILLAGÁSZAT', category: 'Tudomány' },
  { word: 'SZIMMETRIA', category: 'Matematika' },
  { word: 'ELLENÁLLÁS', category: 'Fizika' },
  { word: 'DEMOKRATIKUS', category: 'Politika' },
  { word: 'SZELLEMTUDOMÁNY', category: 'Bölcsészet' },
  { word: 'METAFIZIKA', category: 'Filozófia' },
  { word: 'KRIPTOGRÁFIA', category: 'Informatika' },
  { word: 'ALGORITMUS', category: 'Informatika' },
  { word: 'SZOFTVERMÉRNÖK', category: 'Informatika' },
  { word: 'ADATBÁZIS', category: 'Informatika' },
  { word: 'FEJLESZTŐKÖRNYEZET', category: 'Informatika' },
  { word: 'RENDSZERGAZDA', category: 'Informatika' },
  { word: 'HÁLÓZATBIZTONSÁG', category: 'Informatika' },
];

// Extreme: nagyon ritka, nehéz szavak
const HU_EXTREME: WordEntry[] = [
  { word: 'FOGLYULEJTÉS', category: 'Általános' },
  { word: 'KÖTELEZETTSÉGVÁLLALÁS', category: 'Jog' },
  { word: 'VISSZAUTASÍTHATATLAN', category: 'Fogalmak' },
  { word: 'MEGKÜLÖNBÖZTETHETŐSÉG', category: 'Logika' },
  { word: 'ELFOGADHATATLANSÁG', category: 'Fogalmak' },
  { word: 'SZOCIÁLPSZICHOLÓGIA', category: 'Tudomány' },
  { word: 'KÖZIGAZGATÁSI', category: 'Jog' },
  { word: 'VÉGREHAJTHATÓSÁG', category: 'Jog' },
  { word: 'TERJEDELMESSÉG', category: 'Fogalmak' },
  { word: 'HADÜZENETSZÖVEG', category: 'Történelem' },
  { word: 'SZÉLSŐSÉGESSÉGEK', category: 'Politika' },
  { word: 'ÖRÖKBEADOTTSÁG', category: 'Szociológia' },
  { word: 'KÉNYSZERKIKÉPZÉS', category: 'Katonaság' },
  { word: 'ÖSSZEHASONLÍTHATATLAN', category: 'Fogalmak' },
  { word: 'VISSZACSATOLÁSI', category: 'Műszaki' },
  { word: 'MEGSZEMÉLYESÍTHETETLEN', category: 'Nyelv' },
  { word: 'ELIDEGENÍTHETETLENSÉG', category: 'Jog' },
  { word: 'TERMÉSZETFELETTI', category: 'Misztika' },
  { word: 'MEGTESTESÜLHETETLEN', category: 'Filozófia' },
  { word: 'VISSZAFORDÍTHATATLAN', category: 'Fogalmak' },
];

const WORD_LISTS: Record<Language, Record<Difficulty, WordEntry[]>> = {
  en: {
    easy: EN_EASY,
    medium: EN_MEDIUM,
    hard: EN_HARD,
    extreme: EN_EXTREME,
  },
  hu: {
    easy: HU_EASY,
    medium: HU_MEDIUM,
    hard: HU_HARD,
    extreme: HU_EXTREME,
  }
};

function pickRandomEntry(language: Language, difficulty: Difficulty): WordEntry {
  const list = WORD_LISTS[language][difficulty];
  return list[Math.floor(Math.random() * list.length)];
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
    (s['language'] === 'en' || s['language'] === 'hu') &&
    (s['difficulty'] === 'easy' || s['difficulty'] === 'medium' || s['difficulty'] === 'hard' || s['difficulty'] === 'extreme') &&
    s['version'] === STATE_VERSION
  );
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _settings: GameSettings = this.loadSettings();
  private stateSubject = new BehaviorSubject<GameState>(this.loadOrInit());

  state$ = this.stateSubject.asObservable();

  get state(): GameState {
    return this.stateSubject.getValue();
  }

  get settings(): GameSettings {
    return this._settings;
  }

  get wrongGuessCount(): number {
    const { word, guessedLetters } = this.state;
    return guessedLetters.filter(l => !word.toUpperCase().split('').some(c => c === l)).length;
  }

  get maskedWord(): string[] {
    return this.state.word.split('').map(letter => {
      const upper = letter.toUpperCase();
      return this.state.guessedLetters.includes(upper) ? letter : '_';
    });
  }

  private loadSettings(): GameSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<GameSettings>;
        if (
          (parsed.language === 'en' || parsed.language === 'hu') &&
          (parsed.difficulty === 'easy' || parsed.difficulty === 'medium' || parsed.difficulty === 'hard' || parsed.difficulty === 'extreme')
        ) {
          return parsed as GameSettings;
        }
      }
    } catch { /* ignore */ }
    return { language: 'en', difficulty: 'easy' };
  }

  private saveSettings(settings: GameSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  setSettings(settings: GameSettings): void {
    this._settings = settings;
    this.saveSettings(settings);
  }

  private loadOrInit(): GameState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isValidState(parsed)) {
          // Only restore if settings match
          if (parsed.language === this._settings.language && parsed.difficulty === this._settings.difficulty) {
            return parsed;
          }
        }
      }
    } catch {
      // ignore corrupt storage
    }
    return this.buildInitialState();
  }

  private buildInitialState(): GameState {
    const { language, difficulty } = this._settings;
    const entry = pickRandomEntry(language, difficulty);
    return {
      word: entry.word.toUpperCase(),
      category: entry.category,
      guessedLetters: [],
      maxWrongGuesses: DIFFICULTY_MAX_WRONG[difficulty],
      gameStatus: 'playing',
      language,
      difficulty,
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

    const guessedLetters = [...current.guessedLetters, upper];
    const wordUpper = current.word.toUpperCase();
    const wrongCount = guessedLetters.filter(l => !wordUpper.includes(l)).length;

    const allRevealed = wordUpper.split('').every(l => guessedLetters.includes(l));
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

  newGameWithSettings(settings: GameSettings): void {
    this.setSettings(settings);
    const next = this.buildInitialState();
    this.emit(next);
  }

  isLetterGuessed(letter: string): boolean {
    return this.state.guessedLetters.includes(letter.toUpperCase());
  }

  isLetterWrong(letter: string): boolean {
    const upper = letter.toUpperCase();
    return this.state.guessedLetters.includes(upper) && !this.state.word.toUpperCase().includes(upper);
  }
}
