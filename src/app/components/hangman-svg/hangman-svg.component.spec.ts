import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangmanSvgComponent } from './hangman-svg.component';

describe('HangmanSvgComponent', () => {
  let component: HangmanSvgComponent;
  let fixture: ComponentFixture<HangmanSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HangmanSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangmanSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
