import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-word-display',
  templateUrl: './word-display.component.html',
  styleUrl: './word-display.component.scss'
})
export class WordDisplayComponent {
  @Input() maskedWord: string[] = [];
}
