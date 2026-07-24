# Hangman Game

A classic Hangman word-guessing game built with Angular 18.

## About

This project was built using **vibe coding** — an AI-assisted development approach where the developer collaborates with an AI coding assistant (Codemie Code) to design, scaffold, and implement features through natural language conversation. Rather than writing every line manually, the developer described the desired behavior and let the AI generate, refine, and iterate on the code in real time.

## Technologies Used

| Technology | Version | Purpose |
|---|---|---|
| **Angular** | 18.2 | Frontend framework (NgModules architecture) |
| **TypeScript** | 5.5 | Strongly-typed language |
| **RxJS** | 7.8 | Reactive state management via `BehaviorSubject` |
| **SCSS** | — | Component styling & global styles |
| **Karma + Jasmine** | 6.4 / 5.2 | Unit testing |
| **Angular CLI** | 18.2.21 | Project scaffolding and build tooling |

## Features

- SVG hangman figure that progressively reveals with each wrong guess
- Animated word display with masked letters (`_`)
- Full A–Z on-screen keyboard with correct/wrong letter highlighting
- Physical keyboard support — just type a letter to guess
- Word categories (Programming, Technology, General)
- Win/loss score tracker within the session
- Game state persisted to `localStorage` so progress survives page refresh
- 6 wrong guesses allowed before the game is lost

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── hangman-svg/      # SVG figure component
│   │   └── word-display/     # Masked word display component
│   ├── game/                 # Main game view (component + routing module)
│   ├── services/
│   │   └── game.service.ts   # Core game logic & state (BehaviorSubject + localStorage)
│   ├── app.module.ts
│   └── app-routing.module.ts
├── styles.scss               # Global styles
└── index.html
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload on file changes.

### Build for production

```bash
npm run build
```

Build artifacts are placed in the `dist/` directory.

### Run unit tests

```bash
npm test
```

## How to Play

1. A random word is chosen from the word list (with its category shown as a hint).
2. Click a letter on the on-screen keyboard — or press a key on your physical keyboard — to make a guess.
3. Correct letters are revealed in the word; wrong guesses add a body part to the hangman figure.
4. You have **6 wrong guesses** before the game ends.
5. Click **New Game** at any time to start a fresh round.
