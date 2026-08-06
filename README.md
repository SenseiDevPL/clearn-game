# clearn-game — Memory Debugger

Interaktywna gra do nauki języka C w przeglądarce, robocza nazwa **Memory Debugger**.

Stack: React + Vite + TypeScript, Monaco Editor, Tailwind CSS, [JSCPP](https://github.com/felixhao28/JSCPP) jako interpreter C działający w Web Workerze.

## Uruchomienie

```
npm install
npm run dev
```

## Jak to działa

Kod studenta jest uruchamiany w Web Workerze (`src/lib/cpp.worker.ts`) przez JSCPP, z limitem czasu 4s na wypadek nieskończonych pętli (`src/lib/runCpp.ts`). Poziomy są zdefiniowane w `src/levels/levels.ts`.

Dwa rodzaje poziomów (`Level` to unia typów w `src/types.ts`):

- **`kind: 'output'`** (poziomy 1-6) — walidacja przez dokładne dopasowanie stdout do `expectedOutput`.
- **`kind: 'memory'`** (poziom 7+) — walidacja przez rzeczywiste śledzenie alokacji `malloc`/`free` podczas wykonania kodu, nie przez parsowanie tekstu. `src/lib/heapAllocator.ts` rejestruje własne `malloc`/`free` w runtime JSCPP (biblioteka nie ma ich wcale — sprawdzone w źródle), zwracając listę zdarzeń alloc/free z rozmiarami. `src/components/MemoryVisualizer.tsx` odtwarza tę listę z animacją (pasek RAM, log zdarzeń, ostrzeżenie, CRASH/SUCCESS) i raportuje wynik do `App.tsx`, które aktualizuje progres.

## Znane ograniczenia JSCPP

- Nieaktywnie utrzymywany (ostatni realny release 2021).
- Brak wsparcia dla struct, OOP, goto.
- Brak `malloc`/`free`/`calloc`/`realloc` w ogóle — dograne ręcznie na poziom 7, patrz `heapAllocator.ts`. Zarejestrowany wskaźnik z `malloc()` **nie da się dereferencjonować** (`*p = x` rzuca "is not a left value" — błąd wewnętrzny interpretera, nie doszedłem do przyczyny, nie warto dalej kopać w nieudokumentowanym, martwym projekcie). Poziomy oparte o ten heap mogą tylko alokować/zwalniać, nie zapisywać przez wskaźnik.
- **Bug**: spacja bezpośrednio po przecinku w tekście wypisywanym przez `printf`/`puts` znika (`"a, b"` → `"a,b"`) — unikać przecinka+spacji w treściach poziomów.
- Wymaga polyfilla modułu `stream` w przeglądarce (`vite-plugin-node-polyfills`) — zależność `printf`, której JSCPP używa wewnętrznie, robi `instanceof require('stream').Stream`, co bez polyfilla wywala się na każdym wywołaniu printf.

## Plan

Structs i dowolne wskaźnikowe operacje (w tym zapis przez wskaźnik z malloc) zostają na fazę 2 — prawdziwy kompilator (gcc) na własnym serwerze zamiast interpretera w przeglądarce.
