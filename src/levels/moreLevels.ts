import type { Level } from '../types'

// Levels added 2026-09-25. Ids continue after the original 7; the play
// order is set in levels.ts, so new topics can sit between old ones.
export const moreLevels: Level[] = [
  {
    id: 8,
    kind: 'output',
    title: 'Temperatura pieca',
    concept: 'double, %.1f',
    lesson: {
      paragraphs: [
        'Do tej pory liczby były całe: 5, 12, 42. Do liczb z przecinkiem służy typ `double`.',
        'Uwaga: w C zamiast przecinka piszesz kropkę — `36.6`, a nie 36,6.',
        'Żeby wypisać taką liczbę, w printf używasz `%.1f` — to znaczy „liczba z jedną cyfrą po kropce”. `%.2f` dałoby dwie cyfry.',
      ],
      example: `double cena = 2.5;
printf("%.1f\\n", cena * 2);`,
      exampleOutput: `5.0`,
    },
    solutionWhere: 'Pod linijką // Wypisz temperaturę po podgrzaniu wpisz:',
    solutionSnippet: `printf("%.1f\\n", temp + 0.5);`,
    instructions:
      'Piec ma temperaturę 36.6. Po podgrzaniu rośnie o 0.5. Wypisz nową temperaturę z jedną cyfrą po kropce.',
    starterCode: `#include <stdio.h>

int main() {
    double temp = 36.6;
    // Wypisz temperaturę po podgrzaniu

    return 0;
}
`,
    hints: ['Użyj %.1f w printf.', 'Dodawanie zrobisz wprost w printf: temp + 0.5'],
    solution: `#include <stdio.h>

int main() {
    double temp = 36.6;
    printf("%.1f\\n", temp + 0.5);
    return 0;
}
`,
    expectedOutput: '37.1',
  },
  {
    id: 9,
    kind: 'output',
    title: 'Czujnik w normie',
    concept: '&& i ||',
    lesson: {
      paragraphs: [
        'Czasem jeden warunek to za mało. `&&` znaczy „i” — oba warunki muszą być prawdziwe.',
        '`||` znaczy „lub” — wystarczy, że jeden z warunków jest prawdziwy.',
        'Przykład z życia: „wejdę, jeśli mam bilet i jestem trzeźwy” to `&&`. „Zapłacę gotówką lub kartą” to `||`.',
      ],
      example: `int wiek = 30;
if (wiek > 12 && wiek < 20) {
    printf("nastolatek\\n");
} else {
    printf("nie nastolatek\\n");
}`,
      exampleOutput: `nie nastolatek`,
    },
    solutionWhere: 'Pod linijką // Twój kod if tutaj wpisz:',
    solutionSnippet: `if (t >= 18 && t <= 25) {
    printf("idealnie\\n");
} else {
    printf("zle\\n");
}`,
    instructions:
      'Czujnik pokazuje t = 22. Jeśli t jest od 18 do 25 (włącznie), wypisz "idealnie". W przeciwnym razie wypisz "zle".',
    starterCode: `#include <stdio.h>

int main() {
    int t = 22;
    // Twój kod if tutaj

    return 0;
}
`,
    hints: ['Dwa warunki: t >= 18 oraz t <= 25.', 'Połącz je znakiem && wewnątrz jednego if.'],
    solution: `#include <stdio.h>

int main() {
    int t = 22;
    if (t >= 18 && t <= 25) {
        printf("idealnie\\n");
    } else {
        printf("zle\\n");
    }
    return 0;
}
`,
    expectedOutput: 'idealnie',
  },
  {
    id: 10,
    kind: 'output',
    title: 'Panel sterowania',
    concept: 'switch',
    lesson: {
      paragraphs: [
        '`switch` to jak pilot z przyciskami: zależnie od numeru robi coś innego.',
        '`case 1:` znaczy „jeśli to jest 1, zrób to, co poniżej”.',
        '`break;` znaczy „koniec, wyjdź”. Bez niego komputer poleci dalej i wykona też następny przypadek.',
        '`default:` to „każdy inny przypadek” — jak żaden case nie pasuje.',
      ],
      example: `int kolor = 1;
switch (kolor) {
    case 1:
        printf("czerwony\\n");
        break;
    case 2:
        printf("zielony\\n");
        break;
    default:
        printf("inny\\n");
}`,
      exampleOutput: `czerwony`,
    },
    solutionWhere: 'Pod linijką // Twój switch tutaj wpisz:',
    solutionSnippet: `switch (przycisk) {
    case 1:
        printf("start\\n");
        break;
    case 2:
        printf("stop\\n");
        break;
    default:
        printf("nieznany\\n");
}`,
    instructions:
      'Wciśnięto przycisk nr 2. Użyj switch: dla 1 wypisz "start", dla 2 wypisz "stop", dla każdego innego wypisz "nieznany".',
    starterCode: `#include <stdio.h>

int main() {
    int przycisk = 2;
    // Twój switch tutaj

    return 0;
}
`,
    hints: ['switch (przycisk) { case 1: ... break; case 2: ... break; default: ... }', 'Pamiętaj o break po każdym case.'],
    solution: `#include <stdio.h>

int main() {
    int przycisk = 2;
    switch (przycisk) {
        case 1:
            printf("start\\n");
            break;
        case 2:
            printf("stop\\n");
            break;
        default:
            printf("nieznany\\n");
    }
    return 0;
}
`,
    expectedOutput: 'stop',
  },
  {
    id: 11,
    kind: 'output',
    title: 'Co drugi element',
    concept: 'reszta z dzielenia %',
    lesson: {
      paragraphs: [
        '`%` między dwiema liczbami to reszta z dzielenia. `7 % 2` daje 1 (7 to trzy dwójki i 1 zostaje).',
        '`8 % 2` daje 0 — nic nie zostaje. Tak sprawdzasz, czy liczba jest parzysta: `i % 2 == 0`.',
        'Pamiętaj: `==` (dwa znaki) to porównanie, a `=` (jeden) to wkładanie wartości do zmiennej.',
      ],
      example: `printf("%d\\n", 17 % 5);`,
      exampleOutput: `2`,
    },
    solutionWhere: 'W środku pętli, pod linijką // Twój kod tutaj, wpisz:',
    solutionSnippet: `if (i % 2 == 0) {
    printf("%d\\n", i);
}`,
    instructions:
      'Pętla już liczy od 1 do 10. Dopisz w środku kod, który wypisze tylko liczby parzyste — każdą w nowej linii.',
    starterCode: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 10; i++) {
        // Twój kod tutaj
    }
    return 0;
}
`,
    hints: ['Liczba jest parzysta, gdy i % 2 == 0.', 'Wewnątrz if wypisz i przez printf("%d\\n", i);'],
    solution: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) {
            printf("%d\\n", i);
        }
    }
    return 0;
}
`,
    expectedOutput: '2\n4\n6\n8\n10',
  },
  {
    id: 12,
    kind: 'output',
    title: 'Magazyn części',
    concept: 'tablice',
    lesson: {
      paragraphs: [
        'Tablica to szafka z ponumerowanymi szufladami. W każdej szufladzie leży jedna liczba.',
        '`int t[3] = {10, 20, 30};` tworzy szafkę na 3 liczby i od razu je wkłada.',
        'Szuflady numeruje się od zera! `t[0]` to 10, `t[1]` to 20, `t[2]` to 30.',
        'Żeby przejrzeć wszystkie szuflady, używasz pętli for od 0 do mniej niż liczba szuflad.',
      ],
      example: `int t[3] = {10, 20, 30};
printf("%d\\n", t[1]);`,
      exampleOutput: `20`,
    },
    solutionWhere: 'Pod linijką // Pętla sumująca tutaj wpisz:',
    solutionSnippet: `for (int i = 0; i < 5; i++) {
    suma += czesci[i];
}`,
    instructions:
      'W magazynie jest 5 półek z częściami: 3, 7, 1, 9, 4. Zsumuj wszystkie części pętlą i wypisz wynik.',
    starterCode: `#include <stdio.h>

int main() {
    int czesci[5] = {3, 7, 1, 9, 4};
    int suma = 0;
    // Pętla sumująca tutaj

    printf("%d\\n", suma);
    return 0;
}
`,
    hints: ['for (int i = 0; i < 5; i++)', 'W środku: suma += czesci[i];'],
    solution: `#include <stdio.h>

int main() {
    int czesci[5] = {3, 7, 1, 9, 4};
    int suma = 0;
    for (int i = 0; i < 5; i++) {
        suma += czesci[i];
    }
    printf("%d\\n", suma);
    return 0;
}
`,
    expectedOutput: '24',
  },
  {
    id: 13,
    kind: 'output',
    title: 'Własne narzędzie',
    concept: 'funkcje',
    lesson: {
      paragraphs: [
        'Funkcja to własne narzędzie z nazwą: piszesz je raz, a potem używasz ile chcesz. printf to też funkcja, tylko ktoś ją napisał za Ciebie.',
        '`int podwoj(int n)` czytasz tak: narzędzie „podwoj” dostaje liczbę `n` i oddaje liczbę (`int` na początku).',
        '`return` znaczy „oddaj ten wynik temu, kto mnie użył”.',
        'Funkcję piszesz nad main(), a używasz jej w main(), np. `podwoj(4)`.',
      ],
      example: `int podwoj(int n) {
    return n * 2;
}

int main() {
    printf("%d\\n", podwoj(4));
    return 0;
}`,
      exampleOutput: `8`,
    },
    solutionWhere: 'Pod linijką // Tutaj napisz funkcję kwadrat (nad main) wpisz:',
    solutionSnippet: `int kwadrat(int n) {
    return n * n;
}`,
    instructions:
      'Napisz funkcję kwadrat, która dostaje liczbę n i oddaje n razy n. Program w main() już jej używa i wypisze kwadrat(7).',
    starterCode: `#include <stdio.h>

// Tutaj napisz funkcję kwadrat

int main() {
    printf("%d\\n", kwadrat(7));
    return 0;
}
`,
    hints: ['int kwadrat(int n) { ... }', 'W środku: return n * n;'],
    solution: `#include <stdio.h>

int kwadrat(int n) {
    return n * n;
}

int main() {
    printf("%d\\n", kwadrat(7));
    return 0;
}
`,
    expectedOutput: '49',
  },
  {
    id: 14,
    kind: 'output',
    title: 'Tabliczka znamionowa',
    concept: 'napisy (char)',
    lesson: {
      paragraphs: [
        'Napis w C to tablica liter. `char s[] = "Kot";` to szafka z szufladami: K, o, t — i jeszcze jedna, ukryta.',
        'Ta ukryta ostatnia szuflada to `\'\\0\'` — znak końca napisu. Dzięki niemu komputer wie, gdzie napis się kończy.',
        'Jedną literę piszesz w apostrofach: `\'K\'`. Cały napis w cudzysłowie: `"Kot"`.',
        'W printf: `%c` wypisuje jedną literę, `%s` cały napis.',
      ],
      example: `char s[] = "Kot";
printf("%c\\n", s[0]);
printf("%s\\n", s);`,
      exampleOutput: `K
Kot`,
    },
    solutionWhere: 'Pod linijką // Pętla while licząca litery wpisz:',
    solutionSnippet: `while (nazwa[dlugosc] != '\\0') {
    dlugosc++;
}`,
    instructions:
      'Na tabliczce maszyny jest nazwa "Robot". Policz pętlą while, ile ma liter: idź po szufladach, aż trafisz na znak końca \'\\0\'. Wypisz liczbę liter.',
    starterCode: `#include <stdio.h>

int main() {
    char nazwa[] = "Robot";
    int dlugosc = 0;
    // Pętla while licząca litery

    printf("%d\\n", dlugosc);
    return 0;
}
`,
    hints: ["Warunek pętli: nazwa[dlugosc] != '\\0'", 'W środku pętli: dlugosc++;'],
    solution: `#include <stdio.h>

int main() {
    char nazwa[] = "Robot";
    int dlugosc = 0;
    while (nazwa[dlugosc] != '\\0') {
        dlugosc++;
    }
    printf("%d\\n", dlugosc);
    return 0;
}
`,
    expectedOutput: '5',
  },
  {
    id: 15,
    kind: 'output',
    title: 'Zdalna naprawa',
    concept: 'wskaźnik w funkcji',
    lesson: {
      paragraphs: [
        'Gdy dajesz funkcji zwykłą liczbę, funkcja dostaje jej kopię — jak ksero. Zmienia kopię, a oryginał zostaje bez zmian.',
        'Gdy dajesz funkcji adres (`&a`), funkcja wie, gdzie mieszka oryginał, i może go zmienić.',
        '`int *x` w nawiasie funkcji znaczy „dostaję adres liczby”. `*x` to liczba pod tym adresem.',
      ],
      example: `void zeruj(int *x) {
    *x = 0;
}

int main() {
    int a = 5;
    zeruj(&a);
    printf("%d\\n", a);
    return 0;
}`,
      exampleOutput: `0`,
    },
    solutionWhere: 'W funkcji podwoj, pod linijką // Twój kod tutaj, wpisz:',
    solutionSnippet: `*x = *x * 2;`,
    instructions:
      'Funkcja podwoj dostaje adres liczby. Dopisz w niej jedną linijkę, która podwoi liczbę pod tym adresem. main() wypisze wtedy 42.',
    starterCode: `#include <stdio.h>

void podwoj(int *x) {
    // Twój kod tutaj
}

int main() {
    int a = 21;
    podwoj(&a);
    printf("%d\\n", a);
    return 0;
}
`,
    hints: ['*x to liczba pod adresem.', '*x = *x * 2; — weź liczbę, pomnóż przez 2, włóż z powrotem.'],
    solution: `#include <stdio.h>

void podwoj(int *x) {
    *x = *x * 2;
}

int main() {
    int a = 21;
    podwoj(&a);
    printf("%d\\n", a);
    return 0;
}
`,
    expectedOutput: '42',
  },
]
