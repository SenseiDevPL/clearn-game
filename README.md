# clearn-game

Interaktywna gra do nauki języka C w przeglądarce.

Stack: React + Vite + TypeScript, Phaser (do zrobienia — warstwa wizualna), Monaco Editor, Tailwind CSS, [JSCPP](https://github.com/felixhao28/JSCPP) jako interpreter C działający w Web Workerze.

## Uruchomienie

```
npm install
npm run dev
```

## Jak to działa

Kod studenta jest uruchamiany w Web Workerze (`src/lib/cpp.worker.ts`) przez JSCPP, z limitem czasu 4s na wypadek nieskończonych pętli (`src/lib/runCpp.ts`). Poziomy są zdefiniowane w `src/levels/levels.ts` — każdy ma treść, kod startowy, podpowiedzi i oczekiwany output.

## Znane ograniczenia JSCPP

- Nieaktywnie utrzymywany (ostatni realny release 2021).
- Brak wsparcia dla struct, OOP, goto.
- **Bug**: spacja bezpośrednio po przecinku w tekście wypisywanym przez `printf`/`puts` znika (`"a, b"` → `"a,b"`) — unikać przecinka+spacji w treściach poziomów.
- Wymaga polyfilla modułu `stream` w przeglądarce (`vite-plugin-node-polyfills`) — zależność `printf`, której JSCPP używa wewnętrznie, robi `instanceof require('stream').Stream`, co bez polyfilla wywala się na każdym wywołaniu printf.

## Plan

Struktury, wskaźniki na wskaźniki i dynamiczna pamięć (`malloc`/`free`) zostają na fazę 2 — prawdziwy kompilator (gcc) na własnym serwerze zamiast interpretera w przeglądarce.
