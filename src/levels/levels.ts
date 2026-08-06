import type { Level } from '../types'

export const levels: Level[] = [
  {
    id: 1,
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
]
