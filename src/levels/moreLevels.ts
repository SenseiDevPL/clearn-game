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
  {
    id: 16,
    kind: 'output',
    title: 'Największa część',
    concept: 'szukanie maksimum',
    lesson: {
      paragraphs: [
        'Jak znaleźć największą liczbę w tablicy? Tak jak człowiek: bierzesz pierwszą i zapamiętujesz ją jako „najlepszą do tej pory”.',
        'Potem przeglądasz resztę po kolei. Jeśli trafisz na większą — zapamiętujesz ją zamiast starej.',
        'Na końcu w pamięci zostaje ta największa. `if (t[i] > m) { m = t[i]; }` to właśnie „jeśli ta jest większa, zapamiętaj ją”.',
      ],
      example: `int t[4] = {2, 8, 5, 1};
int m = t[0];
for (int i = 1; i < 4; i++) {
    if (t[i] > m) {
        m = t[i];
    }
}
printf("%d\\n", m);`,
      exampleOutput: `8`,
    },
    solutionWhere: 'Pod linijką // Pętla szukająca największej wpisz:',
    solutionSnippet: `for (int i = 1; i < 5; i++) {
    if (czesci[i] > najwieksza) {
        najwieksza = czesci[i];
    }
}`,
    instructions:
      'Na półkach leżą części o wadze 3, 7, 1, 9, 4. Znajdź pętlą najcięższą i wypisz jej wagę.',
    starterCode: `#include <stdio.h>

int main() {
    int czesci[5] = {3, 7, 1, 9, 4};
    int najwieksza = czesci[0];
    // Pętla szukająca największej

    printf("%d\\n", najwieksza);
    return 0;
}
`,
    hints: ['Zacznij pętlę od i = 1 (pierwszą już zapamiętałeś).', 'if (czesci[i] > najwieksza) { najwieksza = czesci[i]; }'],
    solution: `#include <stdio.h>

int main() {
    int czesci[5] = {3, 7, 1, 9, 4};
    int najwieksza = czesci[0];
    for (int i = 1; i < 5; i++) {
        if (czesci[i] > najwieksza) {
            najwieksza = czesci[i];
        }
    }
    printf("%d\\n", najwieksza);
    return 0;
}
`,
    expectedOutput: '9',
  },
  {
    id: 17,
    kind: 'output',
    title: 'Panel świetlny',
    concept: 'pętla w pętli',
    lesson: {
      paragraphs: [
        'Pętla może być w środku innej pętli. Jak zegar: wskazówka minutowa robi pełne kółko, zanim godzinowa przesunie się o jeden.',
        'Zewnętrzna pętla liczy wiersze. Wewnętrzna — ile znaków w jednym wierszu.',
        '`printf("*");` bez `\\n` stawia gwiazdkę i zostaje w tej samej linii. Dopiero `printf("\\n");` przechodzi do następnej.',
      ],
      example: `for (int w = 0; w < 2; w++) {
    for (int k = 0; k < 3; k++) {
        printf("#");
    }
    printf("\\n");
}`,
      exampleOutput: `###
###`,
    },
    solutionWhere: 'W środku zewnętrznej pętli, pod linijką // Twój kod tutaj, wpisz:',
    solutionSnippet: `for (int k = 0; k < 4; k++) {
    printf("*");
}
printf("\\n");`,
    instructions:
      'Zapal panel świetlny: 3 wiersze, w każdym 4 gwiazdki (****). Zewnętrzna pętla już liczy wiersze — dopisz w środku rysowanie jednego wiersza.',
    starterCode: `#include <stdio.h>

int main() {
    for (int w = 0; w < 3; w++) {
        // Twój kod tutaj
    }
    return 0;
}
`,
    hints: ['Wewnętrzna pętla: for (int k = 0; k < 4; k++) { printf("*"); }', 'Po wewnętrznej pętli: printf("\\n"); żeby zacząć nowy wiersz.'],
    solution: `#include <stdio.h>

int main() {
    for (int w = 0; w < 3; w++) {
        for (int k = 0; k < 4; k++) {
            printf("*");
        }
        printf("\\n");
    }
    return 0;
}
`,
    expectedOutput: '****\n****\n****',
  },
  {
    id: 18,
    kind: 'output',
    title: 'Licznik obrotów',
    concept: 'funkcja z pętlą',
    lesson: {
      paragraphs: [
        'W funkcji możesz używać wszystkiego, co już znasz: zmiennych, pętli, warunków.',
        'Silnia liczby to mnożenie wszystkich liczb od 1 do niej. Silnia z 4 to 1 · 2 · 3 · 4 = 24.',
        'Sposób: zacznij od wyniku 1 i w pętli mnóż go przez kolejne liczby. `w *= i;` znaczy „pomnóż w przez i”.',
      ],
      example: `int suma_do(int n) {
    int w = 0;
    for (int i = 1; i <= n; i++) {
        w += i;
    }
    return w;
}
// suma_do(4) daje 1 + 2 + 3 + 4
printf("%d\\n", suma_do(4));`,
      exampleOutput: `10`,
    },
    solutionWhere: 'W funkcji silnia, pod linijką // Twój kod tutaj, wpisz:',
    solutionSnippet: `int w = 1;
for (int i = 2; i <= n; i++) {
    w *= i;
}
return w;`,
    instructions:
      'Dokończ funkcję silnia: ma oddać iloczyn liczb od 1 do n. main() wypisze silnia(5), czyli powinno wyjść 120.',
    starterCode: `#include <stdio.h>

int silnia(int n) {
    // Twój kod tutaj
}

int main() {
    printf("%d\\n", silnia(5));
    return 0;
}
`,
    hints: ['Zacznij od int w = 1; (nie od zera — mnożenie przez 0 daje zawsze 0).', 'Pętla od 2 do n, w środku w *= i; a na końcu return w;'],
    solution: `#include <stdio.h>

int silnia(int n) {
    int w = 1;
    for (int i = 2; i <= n; i++) {
        w *= i;
    }
    return w;
}

int main() {
    printf("%d\\n", silnia(5));
    return 0;
}
`,
    expectedOutput: '120',
  },
  {
    id: 19,
    kind: 'output',
    title: 'Lustrzany wyświetlacz',
    concept: 'napis od tyłu',
    lesson: {
      paragraphs: [
        'Pętla nie musi iść w górę. `for (int i = 4; i >= 0; i--)` idzie w dół: 4, 3, 2, 1, 0.',
        'Napis "Robot" ma litery w szufladach 0–4: R=0, o=1, b=2, o=3, t=4.',
        'Jeśli przejdziesz szuflady od 4 do 0 i wypiszesz każdą literę przez `%c`, dostaniesz napis od tyłu.',
      ],
      example: `char s[] = "Kot";
for (int i = 2; i >= 0; i--) {
    printf("%c", s[i]);
}
printf("\\n");`,
      exampleOutput: `toK`,
    },
    solutionWhere: 'Pod linijką // Pętla od tyłu tutaj wpisz:',
    solutionSnippet: `for (int i = 4; i >= 0; i--) {
    printf("%c", nazwa[i]);
}`,
    instructions:
      'Wyświetlacz maszyny jest odwrócony. Wypisz napis "Robot" od tyłu — litera po literze, bez spacji.',
    starterCode: `#include <stdio.h>

int main() {
    char nazwa[] = "Robot";
    // Pętla od tyłu tutaj

    printf("\\n");
    return 0;
}
`,
    hints: ['Ostatnia litera to nazwa[4], pierwsza to nazwa[0].', 'for (int i = 4; i >= 0; i--) { printf("%c", nazwa[i]); }'],
    solution: `#include <stdio.h>

int main() {
    char nazwa[] = "Robot";
    for (int i = 4; i >= 0; i--) {
        printf("%c", nazwa[i]);
    }
    printf("\\n");
    return 0;
}
`,
    expectedOutput: 'toboR',
  },
  {
    id: 20,
    kind: 'memory',
    title: 'Memory Debugger: podwójne zwolnienie',
    concept: 'double free',
    lesson: {
      paragraphs: [
        'Pamiętasz: `malloc()` wypożycza skrzynkę z magazynu, `free()` ją oddaje.',
        'A co, jeśli oddasz tę samą skrzynkę dwa razy? Magazyn wpisze ją do wolnych dwa razy i potem wyda ją dwóm różnym osobom naraz. Chaos.',
        'To błąd „double free” — prawdziwe programy od tego padają, a hakerzy potrafią go wykorzystać do włamań.',
        'Zasada: każdy blok pamięci oddajesz dokładnie raz. Nie zero razy (wyciek), nie dwa razy (double free).',
      ],
      example: `int *dane = malloc(sizeof(int) * 10);
free(dane);
// free(dane);  <- drugi raz = AWARIA`,
      exampleOutput: `(pamięć oddana raz — wszystko w porządku)`,
    },
    solutionWhere: 'Usuń drugie free(bufor); — to pod komentarzem o sprzątaniu. Funkcja ma wyglądać tak:',
    solutionSnippet: `void przetworz_pakiet() {
    int *bufor = malloc(sizeof(int) * 64);
    free(bufor);
}`,
    instructions:
      'Ktoś „na wszelki wypadek” dopisał drugie free(bufor) na końcu funkcji. Teraz serwer pada przy pierwszym pakiecie. Znajdź i usuń nadmiarowe free.',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

void przetworz_pakiet() {
    int *bufor = malloc(sizeof(int) * 64);
    free(bufor);
    // sprzatanie na wszelki wypadek
    free(bufor);
}

int main() {
    for (int i = 0; i < 12; i++) {
        przetworz_pakiet();
    }
    printf("Przetworzono 12 pakietow.\\n");
    return 0;
}
`,
    hints: ['W funkcji są dwa free(bufor); — jedno wystarczy.', 'Usuń ostatnie free(bufor); razem z komentarzem nad nim.'],
    solution: `#include <stdio.h>
#include <stdlib.h>

void przetworz_pakiet() {
    int *bufor = malloc(sizeof(int) * 64);
    free(bufor);
}

int main() {
    for (int i = 0; i < 12; i++) {
        przetworz_pakiet();
    }
    printf("Przetworzono 12 pakietow.\\n");
    return 0;
}
`,
    memoryLimitBytes: 2048,
    warningThresholdFraction: 0.6,
  },
]
