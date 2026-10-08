// JSCPP's error messages, said plainly in Polish. JSCPP stops on mistakes
// that real C lets through silently (out-of-bounds, uninitialised values,
// overflow) — each explanation says what real C would have done instead,
// because that silent damage is the whole lesson.
const RULES: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/index out of bound (-?\d+) >= (\d+)/, (m) =>
    `Wyjście poza tablicę: indeks ${m[1]}, a tablica ma ${m[2]} miejsc (od 0 do ${Number(m[2]) - 1}). Prawdziwe C nie zatrzymałoby programu — po cichu zapisałoby albo odczytało cudzą pamięć.`],
  [/negative index (-?\d+)/, (m) =>
    `Ujemny indeks tablicy (${m[1]}). Prawdziwe C sięgnęłoby po cichu do pamięci PRZED tablicą — to klasyczna dziura bezpieczeństwa.`],
  [/uninitialized value|overflow of NaN/, () =>
    'Użyto zmiennej, której nic nie przypisano. W prawdziwym C byłyby w niej przypadkowe „śmieci” z pamięci — za każdym razem inne.'],
  [/overflow of '(.)'\(char\)/, (m) =>
    `Znak „${m[1]}” nie mieści się w jednym bajcie (char). W tej grze — jak w wielu małych urządzeniach — teksty piszemy bez polskich liter.`],
  [/overflow during (post|pre)-increment (-?\d+)\((.+?)\)/, (m) =>
    `Licznik doszedł do ${m[2]}, a typ ${m[3]} tyle nie mieści. Prawdziwe C po cichu przekręciłoby go z powrotem na 0 — jak stary licznik kilometrów.`],
  [/overflow during (post|pre)-decrement/, () =>
    'Licznik bez znaku (unsigned) zszedł poniżej zera. Prawdziwe C zrobiłoby z niego ogromną liczbę (4294967295) i pętla nigdy by się nie skończyła.'],
  [/overflow when casting (-?\d+)\(.*?\) to (.+)/, (m) =>
    `Liczba ${m[1]} nie mieści się w typie ${m[2]}. Prawdziwe C po cichu by ją „zawinęło” i wyszłaby zupełnie inna wartość.`],
  [/overflow of (-?\d+)\((.+?)\)/, (m) =>
    `Przepełnienie: wynik ${m[1]} nie mieści się w typie ${m[2]}. Prawdziwe C po cichu dałoby bzdurną (często ujemną) liczbę.`],
  [/variable (\w+) does not exist/, (m) =>
    `Nie ma czegoś takiego jak ${m[1]} — ani zmiennej, ani funkcji w standardowym C. AI mogło to zmyślić albo wziąć z innego języka.`],
  [/insufficient arguments/, () =>
    'printf dostał za mało danych do wstawienia (np. %d bez liczby). Prawdziwe C wypisałoby wtedy przypadkowe dane z pamięci.'],
  [/you must return a value/, () =>
    'Funkcja obiecuje oddać wynik (np. int przed nazwą), ale nie ma return z wartością. Dopisz return ...; na końcu funkcji.'],
  [/type struct .* is not defined|type enum .* is not defined/, () =>
    'Ta gra nie obsługuje struct ani enum — zamiast nich użyj osobnych zmiennych, tablic albo #define.'],
]

export function explainCError(raw: string): string {
  const line = raw.match(/^(\d+):\d+\s+/)
  const text = line ? raw.slice(line[0].length) : raw
  for (const [re, say] of RULES) {
    const m = text.match(re)
    if (m) return (line ? `Linia ${line[1]}: ` : '') + say(m)
  }
  return raw
}

// Messages of the real compiler (xcc), e.g. "/tmp/main.c(4): `;' expected"
// followed by the offending line and a ^ marker — kept, they help.
const COMPILE_RULES: [RegExp, string][] = [
  [/`([^']+)' undeclared/, 'nie znam nazwy „$1” — zmienna nie została utworzona (np. int $1 = ...), literówka albo brakuje #include'],
  [/`,' or `\)` expected/, 'brakuje przecinka albo nawiasu „)”'],
  [/`([^']+)' expected/, 'brakuje znaku „$1”'],
  [/String not closed/, 'tekst nie jest zamknięty — brakuje cudzysłowu "'],
  [/cannot modify `const'/, 'tej zmiennej (const) nie wolno zmieniać'],
  [/convert value from type `([^']+)' to `([^']+)'/, 'zły typ — nie da się zamienić $1 na $2'],
  [/function `(\w+)' expect (\d+) arguments, but (\d+)/, 'funkcja $1 przyjmuje $2 argument(y/ów), a podano $3'],
]

export function explainCompileError(raw: string): string {
  return raw
    .split('\n')
    .map((line) => {
      const m = line.match(/^\/tmp\/main\.c\((\d+)\):\s*(.*)$/)
      if (!m) return line
      let text = m[2]
      for (const [re, say] of COMPILE_RULES) {
        if (re.test(text)) {
          text = text.replace(new RegExp('.*' + re.source + '.*'), say)
          break
        }
      }
      return `Linia ${m[1]}: ${text}`
    })
    .join('\n')
    .trim()
}

/** WebAssembly traps of the real compiler's programs, said plainly. */
export function explainTrap(raw: string): string {
  if (/divide by zero|division by zero/i.test(raw)) return 'Dzielenie przez zero — program się wysypał.'
  if (/out of bounds/i.test(raw)) return 'Program sięgnął poza swoją pamięć i się wysypał.'
  if (/unreachable/i.test(raw)) return 'Program trafił w miejsce, w które nie powinien — i się wysypał.'
  return raw
}

