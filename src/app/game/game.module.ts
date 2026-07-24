import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { HangmanSvgComponent } from '../components/hangman-svg/hangman-svg.component';
import { WordDisplayComponent } from '../components/word-display/word-display.component';


@NgModule({
  declarations: [
    GameComponent,
    HangmanSvgComponent,
    WordDisplayComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule
  ]
})
export class GameModule { }
