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
