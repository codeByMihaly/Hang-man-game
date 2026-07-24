import { Component, Input, OnChanges } from '@angular/core';

// Each entry represents one body part drawn at a specific wrong-guess count.
interface SvgPart {
  type: 'path' | 'circle';
  d?: string;
  cx?: number;
  cy?: number;
  r?: number;
  revealAt: number; // reveal when wrongGuesses >= this value
  animated?: boolean;
}

@Component({
  selector: 'app-hangman-svg',
  templateUrl: './hangman-svg.component.html',
  styleUrl: './hangman-svg.component.scss'
})
export class HangmanSvgComponent implements OnChanges {
  @Input() wrongGuesses = 0;

  readonly parts: SvgPart[] = [
    // Static scaffold (always visible at revealAt: 0)
    { type: 'path', d: 'M1,11 h8',     revealAt: 0 },  // ground
    { type: 'path', d: 'M9,11 v-10',   revealAt: 0 },  // pole
    { type: 'path', d: 'M9,1 h-4',     revealAt: 0 },  // top beam
    { type: 'path', d: 'M5,1 v2',      revealAt: 0 },  // rope
    // Body parts (revealed on wrong guesses 1–6)
    { type: 'circle', cx: 5, cy: 4, r: 1, revealAt: 1 }, // head
    { type: 'path', d: 'M5,5 v3',      revealAt: 2 },  // torso
    { type: 'path', d: 'M5,5 l-2,2',   revealAt: 3 },  // left arm
    { type: 'path', d: 'M5,5 l2,2',    revealAt: 4 },  // right arm
    { type: 'path', d: 'M5,8 l-2,2',   revealAt: 5 },  // left leg
    { type: 'path', d: 'M5,8 l2,2',    revealAt: 6 },  // right leg
  ];

  visibleParts: SvgPart[] = [];

  ngOnChanges(): void {
    this.visibleParts = this.parts
      .filter(p => this.wrongGuesses >= p.revealAt)
      .map(p => ({
        ...p,
        // Animate the part that just appeared (revealAt === wrongGuesses)
        animated: p.revealAt === this.wrongGuesses && p.revealAt > 0
      }));
  }
}
