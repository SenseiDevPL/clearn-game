import type { Level } from '../types'
import { moreLevels } from './moreLevels'

const baseLevels: Level[] = [
  {
    id: 1,
    lesson: {
      paragraphs: [
        'Program w C to przepis, który komputer wykonuje linijka po linijce, od góry do dołu.',
        'Wszystko, co ma się wykonać, piszesz w środku `main() { ... }` — to „start” programu. Linijek `#include` i `return 0;` nie ruszasz, to stała obudowa.',
        '`printf(...)` to polecenie „wypisz na ekran”. Tekst do wypisania wkładasz w cudzysłów `" "`.',
        '`\\n` na końcu tekstu znaczy „przejdź do nowej linii” — jak naciśnięcie Enter.',
        'Każde polecenie kończysz średnikiem `;` — jak kropką na końcu zdania. Bez niego komputer nie zrozumie.',
      ],
      example: `printf("Dzien dobry!\\n");`,
      exampleOutput: `Dzien dobry!`,
    },
    solutionWhere: 'Pod linijką // Twój kod tutaj wpisz:',
    solutionSnippet: `printf("Witaj w jezyku C!\\n");`,
    kind: 'output',
    title: 'Pierwszy program',
    concept: 'printf',
    instructions:
      'Każdy program w C zaczyna się od main(). Użyj printf(), żeby wypisać dokładnie: Witaj w jezyku C!',
    starterCode: `#include <stdio.h>

int main() {
    // Twój kod tutaj

    return 0;
}
`,
    hints: [
      'printf("tekst\\n"); wypisuje tekst i przechodzi do nowej linii.',
      'Pamiętaj o średniku na końcu instrukcji.',
    ],
    solution: `#include <stdio.h>

int main() {
    printf("Witaj w jezyku C!\\n");
    return 0;
}
`,
    expectedOutput: 'Witaj w jezyku C!',
  },
  {
    id: 2,
    lesson: {
      paragraphs: [
        'Zmienna to pudełko z nazwą, w którym trzymasz liczbę.',
        '`int x = 5;` znaczy: zrób pudełko o nazwie x na liczbę całkowitą (int) i włóż do niego 5.',
        'Na liczbach możesz liczyć: `+` dodawanie, `-` odejmowanie, `*` mnożenie, `/` dzielenie.',
        'Żeby wypisać liczbę, w tekście printf wstawiasz znaczek `%d` — to puste miejsce, w które komputer wstawi liczbę podaną po przecinku.',
      ],
      example: `int x = 5;\nint y = 3;\nprintf("%d\\n", x * y);`,
      exampleOutput: `15`,
    },
    solutionWhere: 'Pod linijką // Wypisz sumę a + b wpisz:',
    solutionSnippet: `printf("%d\\n", a + b);`,
    kind: 'output',
    title: 'Zmienne i arytmetyka',
    concept: 'zmienne, int, +',
    instructions:
      'Zadeklaruj dwie zmienne int: a = 12 i b = 30. Wypisz ich sumę jako liczbę, bez żadnego dodatkowego tekstu.',
    starterCode: `#include <stdio.h>

int main() {
    int a = 12;
    int b = 30;
    // Wypisz sumę a + b

    return 0;
}
`,
    hints: [
      'printf("%d\\n", suma); wypisuje liczbę całkowitą.',
      '%d to specyfikator formatu dla int.',
    ],
    solution: `#include <stdio.h>

int main() {
    int a = 12;
    int b = 30;
    printf("%d\\n", a + b);
    return 0;
}
`,
    expectedOutput: '42',
  },
  {
    id: 3,
    lesson: {
      paragraphs: [
        '`if` znaczy „jeśli”. Komputer sprawdza warunek w nawiasie `( )` i wykonuje kod w klamrach `{ }` tylko wtedy, gdy warunek jest prawdziwy.',
        '`else` znaczy „w przeciwnym razie” — ten kod wykona się, gdy warunek jest fałszywy.',
        'Porównania: `>` większe, `<` mniejsze, `>=` większe lub równe, `<=` mniejsze lub równe, `==` równe (dwa znaki =).',
      ],
      example: `int temperatura = 25;\nif (temperatura > 20) {\n    printf("cieplo\\n");\n} else {\n    printf("zimno\\n");\n}`,
      exampleOutput: `cieplo`,
    },
    solutionWhere: 'Pod linijką // Twój kod if/else tutaj wpisz:',
    solutionSnippet: `if (wiek >= 18) {\n    printf("pelnoletni\\n");\n} else {\n    printf("niepelnoletni\\n");\n}`,
    kind: 'output',
    title: 'Decyzja',
    concept: 'if / else',
    instructions:
      'Zadeklaruj int wiek = 17. Jeśli wiek jest większe lub równe 18, wypisz "pelnoletni", w przeciwnym razie wypisz "niepelnoletni".',
    starterCode: `#include <stdio.h>

int main() {
    int wiek = 17;
    // Twój kod if/else tutaj

    return 0;
}
`,
    hints: [
      'if (warunek) { ... } else { ... }',
      'Operator >= sprawdza "większe lub równe".',
    ],
    solution: `#include <stdio.h>

int main() {
    int wiek = 17;
    if (wiek >= 18) {
        printf("pelnoletni\\n");
    } else {
        printf("niepelnoletni\\n");
    }
    return 0;
}
`,
    expectedOutput: 'niepelnoletni',
  },
  {
    id: 4,
    lesson: {
      paragraphs: [
        'Pętla to powtarzanie tego samego kawałka kodu wiele razy — jak robienie pompek: raz, dwa, trzy…',
        '`for (int i = 1; i <= 3; i++)` czytasz tak: zacznij od i = 1; powtarzaj, dopóki i jest mniejsze lub równe 3; po każdym razie zwiększ i o 1 (`i++`).',
        'Kod w klamrach `{ }` wykona się przy każdym powtórzeniu.',
        '`suma += i;` znaczy: dodaj i do tego, co już jest w sumie.',
      ],
      example: `for (int i = 1; i <= 3; i++) {\n    printf("%d\\n", i);\n}`,
      exampleOutput: `1\n2\n3`,
    },
    solutionWhere: 'Pod linijką // Pętla for tutaj wpisz:',
    solutionSnippet: `for (int i = 1; i <= 5; i++) {\n    suma += i;\n}`,
    kind: 'output',
    title: 'Pętla for',
    concept: 'for',
    instructions:
      'Użyj pętli for, żeby zsumować liczby od 1 do 5 (włącznie) i wypisać wynik jako liczbę.',
    starterCode: `#include <stdio.h>

int main() {
    int suma = 0;
    // Pętla for tutaj

    printf("%d\\n", suma);
    return 0;
}
`,
    hints: [
      'for (int i = 1; i <= 5; i++) { suma += i; }',
      'Nie zapomnij o printf na końcu — już jest w kodzie startowym.',
    ],
    solution: `#include <stdio.h>

int main() {
    int suma = 0;
    for (int i = 1; i <= 5; i++) {
        suma += i;
    }
    printf("%d\\n", suma);
    return 0;
}
`,
    expectedOutput: '15',
  },
  {
    id: 5,
    lesson: {
      paragraphs: [
        '`while` znaczy „dopóki”: powtarzaj kod w klamrach `{ }` tak długo, jak warunek jest prawdziwy.',
        'W środku pętli trzeba coś zmieniać, inaczej warunek zawsze będzie prawdziwy i pętla nigdy się nie skończy (gra przerwie ją po 4 sekundach).',
        '`n++` zwiększa liczbę o 1, `n--` zmniejsza o 1.',
      ],
      example: `int n = 1;\nwhile (n <= 3) {\n    printf("%d\\n", n);\n    n++;\n}`,
      exampleOutput: `1\n2\n3`,
    },
    solutionWhere: 'Pod linijką // Pętla while tutaj wpisz:',
    solutionSnippet: `while (paliwo > 0) {\n    printf("%d\\n", paliwo);\n    paliwo--;\n}`,
    kind: 'output',
    title: 'Pętla while',
    concept: 'while',
    instructions:
      'Zadeklaruj int paliwo = 5. Używając while, odliczaj w dół i wypisz wartość paliwa w każdej iteracji, aż paliwo osiągnie 0 (0 nie wypisuj).',
    starterCode: `#include <stdio.h>

int main() {
    int paliwo = 5;
    // Pętla while tutaj

    return 0;
}
`,
    hints: [
      'while (paliwo > 0) { printf("%d\\n", paliwo); paliwo--; }',
      'paliwo-- zmniejsza wartość o 1.',
    ],
    solution: `#include <stdio.h>

int main() {
    int paliwo = 5;
    while (paliwo > 0) {
        printf("%d\\n", paliwo);
        paliwo--;
    }
    return 0;
}
`,
    expectedOutput: '5\n4\n3\n2\n1',
  },
  {
    id: 6,
    lesson: {
      paragraphs: [
        'Każda zmienna mieszka w pamięci komputera pod jakimś adresem — jak dom przy ulicy.',
        '`&a` znaczy „adres zmiennej a”.',
        '`int *w = &a;` tworzy wskaźnik w — karteczkę, na której zapisany jest adres a.',
        '`*w` znaczy „to, co mieszka pod tym adresem”. Więc `*w = 7;` zmienia wartość a, choć nigdzie nie piszesz a.',
      ],
      example: `int a = 1;\nint *w = &a;\n*w = 7;\nprintf("%d\\n", a);`,
      exampleOutput: `7`,
    },
    solutionWhere: 'Pod linijką // Zadeklaruj wskaźnik p... wpisz:',
    solutionSnippet: `int *p = &x;\n*p = 99;`,
    kind: 'output',
    title: 'Wskaźniki',
    concept: 'wskaźniki, &, *',
    instructions:
      'Zadeklaruj int x = 10. Zadeklaruj wskaźnik int *p wskazujący na x. Przez wskaźnik zmień wartość x na 99, a następnie wypisz x.',
    starterCode: `#include <stdio.h>

int main() {
    int x = 10;
    // Zadeklaruj wskaźnik p i zmień x na 99 przez wskaźnik

    printf("%d\\n", x);
    return 0;
}
`,
    hints: [
      'int *p = &x; deklaruje wskaźnik i wskazuje go na x.',
      '*p = 99; zmienia wartość pod adresem, na który wskazuje p — czyli x.',
    ],
    solution: `#include <stdio.h>

int main() {
    int x = 10;
    int *p = &x;
    *p = 99;
    printf("%d\\n", x);
    return 0;
}
`,
    expectedOutput: '99',
  },
  {
    id: 7,
    lesson: {
      paragraphs: [
        '`malloc()` to wypożyczenie kawałka pamięci od komputera — jak wypożyczenie skrzynki w magazynie.',
        '`free()` to oddanie tej skrzynki. Kto wypożycza i nie oddaje, w końcu opróżni cały magazyn.',
        'To właśnie wyciek pamięci: program działa, ale za każdym razem zabiera trochę więcej, aż pamięć się skończy i program pada.',
        'Zasada: każdy `malloc()` musi mieć swój `free()`, kiedy pamięć nie jest już potrzebna.',
      ],
      example: `int *dane = malloc(sizeof(int) * 10);\n// ... tu używasz dane ...\nfree(dane);`,
      exampleOutput: `(nic nie wypisuje — ale pamięć wraca do komputera)`,
    },
    solutionWhere: 'Zamień linijkę // BUG: brakuje free(bufor)... na:',
    solutionSnippet: `free(bufor);`,
    kind: 'memory',
    title: 'Memory Debugger: wyciek pamięci',
    concept: 'malloc / free',
    instructions:
      'Funkcja przetworz_pakiet() rezerwuje pamięć przez malloc(), ale nigdy jej nie zwalnia. Serwer wywołuje ją w pętli — pamięć RAM rośnie z każdym wywołaniem, aż w końcu zabraknie miejsca. Dopisz brakujące free(bufor), żeby zatrzymać wyciek.',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

void przetworz_pakiet() {
    int *bufor = malloc(sizeof(int) * 64);
    // BUG: brakuje free(bufor) - pamiec nigdy nie jest zwalniana!
}

int main() {
    for (int i = 0; i < 12; i++) {
        przetworz_pakiet();
    }
    printf("Przetworzono 12 pakietow.\\n");
    return 0;
}
`,
    hints: [
      'Każdy malloc() musi mieć odpowiadający mu free() — inaczej pamięć zostaje zajęta na zawsze.',
      'Dodaj free(bufor); na końcu funkcji przetworz_pakiet(), zaraz po tym jak bufor przestaje być potrzebny.',
    ],
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

// Play order: new topics are slotted where they fit the learning path.
const PLAY_ORDER = [1, 2, 8, 3, 9, 10, 4, 11, 17, 5, 12, 16, 13, 18, 14, 19, 6, 15, 7, 20]
const byId = new Map([...baseLevels, ...moreLevels].map((l) => [l.id, l]))

export const levels: Level[] = PLAY_ORDER.map((id) => byId.get(id)!)
