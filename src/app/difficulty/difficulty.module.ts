import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DifficultyRoutingModule } from './difficulty-routing.module';
import { DifficultyComponent } from './difficulty.component';

@NgModule({
  declarations: [DifficultyComponent],
  imports: [
    CommonModule,
    DifficultyRoutingModule
  ]
})
export class DifficultyModule { }
