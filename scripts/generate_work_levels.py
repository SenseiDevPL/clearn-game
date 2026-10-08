"""Generates src/levels/workLevels.ts — levels 21-50, "C w pracy" (devices and
electronics) + "Sprawdź kod od AI". Run: python3 scripts/generate_work_levels.py

Mind the JSCPP interpreter: no struct/enum/stdint, no strcmp/sprintf/snprintf,
atoi only on whole strings, and printf text must be ASCII (no Polish letters).
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AI = "    // 🤖 Kod wygenerowany przez asystenta AI\n"
L = []


def prog(body, top="", includes=("stdio.h",)):
    inc = "".join(f"#include <{i}>\n" for i in includes)
    return f"{inc}{top}\nint main() {{\n{body}    return 0;\n}}\n"


def lv(**k):
    L.append(k)


def ai(**k):
    k["ai"] = True
    lv(**k)


# ---------------- 21-30: C w pracy — urządzenia ----------------
B21 = "    unsigned char diody = 0;   // 8 diod na panelu, każda to jeden bit (od 0 do 7)\n"
lv(id=21, title="Panel diod (bity)", concept="bity, |, <<",
   lesson=["C w pracy to przede wszystkim urządzenia: pralki, sterowniki, czujniki, samochody. Tam jeden bajt często steruje ośmioma diodami naraz — każda dioda to jeden BIT (zero albo jedynka).",
           "`1 << 3` to jedynka przesunięta o 3 miejsca w lewo: bit numer 3 (bity liczy się od 0). `diody = diody | (1 << 3);` zapala diodę nr 3, nie ruszając pozostałych — `|` to „dorzuć”.",
           "`%02X` w printf wypisuje liczbę szesnastkowo (tak inżynierowie zapisują bajty), np. `0A`."],
   example="unsigned char d = 0;\nd = d | (1 << 0);\nd = d | (1 << 2);\nprintf(\"%d 0x%02X\\n\", d, d);", exampleOutput="5 0x05",
   instructions="Zapal diody nr 1 i nr 3 (bity liczone od 0). Program wypisze stan panelu.",
   starterCode=prog(B21 + "    // Zapal diody nr 1 i 3\n\n    printf(\"Diody: %d = 0x%02X\\n\", diody, diody);\n"),
   solution=prog(B21 + "    // Zapal diody nr 1 i 3\n    diody = diody | (1 << 1);\n    diody = diody | (1 << 3);\n    printf(\"Diody: %d = 0x%02X\\n\", diody, diody);\n"),
   solutionWhere="Pod komentarzem // Zapal diody nr 1 i 3 wpisz:", solutionSnippet="diody = diody | (1 << 1);\ndiody = diody | (1 << 3);",
   expectedOutput="Diody: 10 = 0x0A", mustMatch=(r"<<", "Zapalaj diody przesunięciem bitu: diody | (1 << numer)."),
   hints=["Dioda nr 1: diody = diody | (1 << 1);", "Tak samo dioda nr 3, w nowej linijce.", "Bity 1 i 3 to 2 + 8 = 10."])
T22 = "#define BLAD_TEMP      0x01   // bit 0\n#define BLAD_ZASILANIA 0x02   // bit 1\n#define BLAD_CZUJNIKA  0x04   // bit 2\n"
B22 = "    unsigned char status = 0x05;   // tak urządzenie zgłosiło swój stan\n"
lv(id=22, title="Rejestr błędów", concept="sprawdzanie bitu &, #define",
   lesson=["Urządzenia zgłaszają błędy w jednym bajcie: każdy bit to inny problem. Nazwy bitów nadaje się przez `#define` — wtedy kod czyta się jak zdanie.",
           "`status & BLAD_TEMP` sprawdza jeden bit: wynik jest różny od zera tylko, gdy ten bit jest zapalony. `&` to „sprawdź, czy jest”."],
   example="#define DRZWI 0x02\nunsigned char s = 0x03;\nif (s & DRZWI) printf(\"Drzwi otwarte\\n\");", exampleOutput="Drzwi otwarte",
   instructions="Sprawdź każdy z trzech bitów. Dla zapalonych wypisz: Za wysoka temperatura / Brak zasilania / Awaria czujnika (w tej kolejności).",
   starterCode=prog(B22 + "    // Sprawdź każdą flagę: if (status & BLAD_...)\n\n", top=T22),
   solution=prog(B22 + "    // Sprawdź każdą flagę: if (status & BLAD_...)\n    if (status & BLAD_TEMP) printf(\"Za wysoka temperatura\\n\");\n    if (status & BLAD_ZASILANIA) printf(\"Brak zasilania\\n\");\n    if (status & BLAD_CZUJNIKA) printf(\"Awaria czujnika\\n\");\n", top=T22),
   solutionWhere="Pod komentarzem wpisz:", solutionSnippet="if (status & BLAD_TEMP) printf(\"Za wysoka temperatura\\n\");\nif (status & BLAD_ZASILANIA) printf(\"Brak zasilania\\n\");\nif (status & BLAD_CZUJNIKA) printf(\"Awaria czujnika\\n\");",
   expectedOutput="Za wysoka temperatura\nAwaria czujnika", mustMatch=(r"status\s*&\s*BLAD_", "Sprawdzaj bity przez status & BLAD_..."),
   hints=["0x05 to binarnie 101 — zapalone bity 0 i 2.", "if (status & BLAD_TEMP) printf(\"Za wysoka temperatura\\n\");", "Trzy osobne if — po jednym na flagę."])
B23 = "    unsigned char przekazniki = 0x0F;   // przekaźniki 0-3 włączone\n"
lv(id=23, title="Przekaźniki: wyłącz i przełącz", concept="&= ~, ^=",
   lesson=["Wyłączenie jednego bitu: `x &= ~(1 << n);` — `~` odwraca wszystkie bity, więc `& ~` zostawia wszystko oprócz bitu n.",
           "Przełączenie (włączony → wyłączony i odwrotnie): `x ^= (1 << n);` — `^` to „odwróć ten bit”. Tak w sterownikach miga się diodą albo przełącza przekaźnik."],
   example="unsigned char x = 0x07;\nx &= ~(1 << 0);\nx ^= (1 << 3);\nprintf(\"0x%02X\\n\", x);", exampleOutput="0x0E",
   instructions="Wyłącz przekaźnik nr 2 (&= ~) i przełącz przekaźnik nr 7 (^=). Program wypisze stan.",
   starterCode=prog(B23 + "    // Wyłącz przekaźnik 2, przełącz przekaźnik 7\n\n    printf(\"Przekazniki: 0x%02X\\n\", przekazniki);\n"),
   solution=prog(B23 + "    // Wyłącz przekaźnik 2, przełącz przekaźnik 7\n    przekazniki &= ~(1 << 2);\n    przekazniki ^= (1 << 7);\n    printf(\"Przekazniki: 0x%02X\\n\", przekazniki);\n"),
   solutionWhere="Pod komentarzem wpisz:", solutionSnippet="przekazniki &= ~(1 << 2);\nprzekazniki ^= (1 << 7);",
   expectedOutput="Przekazniki: 0x8B", mustMatch=(r"&=\s*~[\s\S]*\^=|\^=[\s\S]*&=\s*~", "Użyj &= ~(1 << 2) i ^= (1 << 7)."),
   hints=["Wyłączenie: przekazniki &= ~(1 << 2);", "Przełączenie: przekazniki ^= (1 << 7);", "0x0F bez bitu 2 to 0x0B, z bitem 7 to 0x8B."])
B24 = "    unsigned char pakiet[] = {0x10, 0x22, 0x3F, 0x05};   // bajty odebrane z czujnika\n    int odebrana = 0x08;   // suma kontrolna dołączona przez nadawcę\n    int suma = 0;\n"
lv(id=24, title="Suma kontrolna pakietu", concept="XOR ^, sprawdzanie danych",
   lesson=["Dane w kablu czy radiu potrafią się przekłamać. Dlatego nadawca dołącza sumę kontrolną, a odbiorca liczy ją sam i porównuje. Najprostsza: XOR wszystkich bajtów (`^`).",
           "Jeśli policzona suma zgadza się z odebraną — pakiet jest cały. Jeśli nie — trzeba poprosić o ponowne wysłanie."],
   example="int s = 0;\ns = s ^ 0x0F;\ns = s ^ 0x03;\nprintf(\"0x%02X\\n\", s);", exampleOutput="0x0C",
   instructions="Policz XOR wszystkich bajtów pakietu, wypisz: Suma kontrolna: 0x.. i porównaj z odebraną — wypisz Pakiet poprawny albo Pakiet uszkodzony.",
   starterCode=prog(B24 + "    // Policz XOR wszystkich bajtów, wypisz i porównaj\n\n"),
   solution=prog(B24 + "    // Policz XOR wszystkich bajtów, wypisz i porównaj\n    for (int i = 0; i < 4; i++) {\n        suma = suma ^ pakiet[i];\n    }\n    printf(\"Suma kontrolna: 0x%02X\\n\", suma);\n    if (suma == odebrana) printf(\"Pakiet poprawny\\n\");\n    else printf(\"Pakiet uszkodzony\\n\");\n"),
   solutionWhere="Pod komentarzem wpisz:", solutionSnippet="for (int i = 0; i < 4; i++) {\n    suma = suma ^ pakiet[i];\n}\nprintf(\"Suma kontrolna: 0x%02X\\n\", suma);\nif (suma == odebrana) printf(\"Pakiet poprawny\\n\");\nelse printf(\"Pakiet uszkodzony\\n\");",
   expectedOutput="Suma kontrolna: 0x08\nPakiet poprawny", mustMatch=(r"\^", "Licz sumę kontrolną przez XOR: suma = suma ^ pakiet[i];"),
   hints=["Pętla po 4 bajtach: suma = suma ^ pakiet[i];", "printf(\"Suma kontrolna: 0x%02X\\n\", suma);", "if (suma == odebrana) ... else ..."])
B25 = "    char komenda[] = \"TEMP=235\";   // przyszło z portu szeregowego: temperatura w dziesiątych stopnia\n    int wartosc = 0;\n    int i = 0;\n"
lv(id=25, title="Komenda z kabla", concept="parsowanie tekstu znak po znaku",
   lesson=["Urządzenia gadają ze sobą tekstem przez kabel (port szeregowy): np. `TEMP=235`. Program musi z tego wyciągnąć liczbę — w małych układach robi się to ręcznie, znak po znaku.",
           "Cyfra jako znak to nie liczba: `'7' - '0'` daje 7. Liczbę buduje się tak: `wartosc = wartosc * 10 + (znak - '0');` — jak dopisywanie cyfr na końcu.",
           "Temperatura przychodzi w dziesiątych stopnia (235 = 23.5), bo małe układy nie lubią ułamków: `wartosc / 10` i `wartosc % 10` dają część całkowitą i dziesiątki."],
   example="char s[] = \"42\";\nint w = 0;\nfor (int k = 0; s[k] != '\\0'; k++) w = w * 10 + (s[k] - '0');\nprintf(\"%d\\n\", w + 1);", exampleOutput="43",
   instructions="Przewiń do znaku = i z cyfr po nim zbuduj liczbę. Program wypisze: Ustawiam temperature: 23.5 C",
   starterCode=prog(B25 + "    // 1. przesuń i za znak '='\n    // 2. z cyfr do końca tekstu zbuduj liczbę w zmiennej wartosc\n\n    printf(\"Ustawiam temperature: %d.%d C\\n\", wartosc / 10, wartosc % 10);\n"),
   solution=prog(B25 + "    // 1. przesuń i za znak '='\n    // 2. z cyfr do końca tekstu zbuduj liczbę w zmiennej wartosc\n    while (komenda[i] != '=') i++;\n    i++;\n    while (komenda[i] != '\\0') {\n        wartosc = wartosc * 10 + (komenda[i] - '0');\n        i++;\n    }\n    printf(\"Ustawiam temperature: %d.%d C\\n\", wartosc / 10, wartosc % 10);\n"),
   solutionWhere="Pod komentarzami wpisz:", solutionSnippet="while (komenda[i] != '=') i++;\ni++;\nwhile (komenda[i] != '\\0') {\n    wartosc = wartosc * 10 + (komenda[i] - '0');\n    i++;\n}",
   expectedOutput="Ustawiam temperature: 23.5 C", mustMatch=(r"-\s*'0'", "Zamieniaj znaki na cyfry przez (znak - '0')."),
   hints=["while (komenda[i] != '=') i++; potem jeszcze i++; żeby przeskoczyć sam znak =", "Druga pętla do końca tekstu: while (komenda[i] != '\\0')", "W środku: wartosc = wartosc * 10 + (komenda[i] - '0'); i++;"])
T26 = "#define CZEKA     0\n#define PIERZE    1\n#define WIROWANIE 2\n#define KONIEC    3\n"
B26 = "    int stan = CZEKA;\n    for (int krok = 0; krok < 4; krok++) {\n"
lv(id=26, title="Pralka: maszyna stanów", concept="switch, stany",
   lesson=["Prawie każde urządzenie to maszyna stanów: pralka czeka, pierze, wiruje, kończy. Program pamięta, w jakim jest stanie (zwykła liczba z nazwą przez #define), i w każdym kroku decyduje, co dalej.",
           "Do tego idealnie pasuje `switch (stan)`: każdy `case` to jeden stan — robi swoje i ustawia następny stan. Nie zapomnij o `break`!"],
   example="switch (stan) {\n    case CZEKA:\n        printf(\"Czeka\\n\");\n        stan = PIERZE;\n        break;\n}", exampleOutput="Czeka",
   instructions="W pętli wypisuj nazwę bieżącego stanu i przechodź do następnego: Czeka → Pierze → Wirowanie → Koniec.",
   starterCode=prog(B26 + "        // switch (stan): wypisz nazwę stanu i ustaw następny\n\n    }\n", top=T26),
   solution=prog(B26 + "        // switch (stan): wypisz nazwę stanu i ustaw następny\n        switch (stan) {\n            case CZEKA: printf(\"Czeka\\n\"); stan = PIERZE; break;\n            case PIERZE: printf(\"Pierze\\n\"); stan = WIROWANIE; break;\n            case WIROWANIE: printf(\"Wirowanie\\n\"); stan = KONIEC; break;\n            case KONIEC: printf(\"Koniec\\n\"); break;\n        }\n    }\n", top=T26),
   solutionWhere="W pętli, pod komentarzem, wpisz:", solutionSnippet="switch (stan) {\n    case CZEKA: printf(\"Czeka\\n\"); stan = PIERZE; break;\n    case PIERZE: printf(\"Pierze\\n\"); stan = WIROWANIE; break;\n    case WIROWANIE: printf(\"Wirowanie\\n\"); stan = KONIEC; break;\n    case KONIEC: printf(\"Koniec\\n\"); break;\n}",
   expectedOutput="Czeka\nPierze\nWirowanie\nKoniec", mustMatch=(r"switch\s*\(\s*stan\s*\)", "Użyj switch (stan) { case ...: }"),
   hints=["switch (stan) { case CZEKA: ... }", "W każdym case: printf z nazwą, ustawienie następnego stanu i break;", "W case KONIEC tylko wypisz i break."])
B27 = "    int temp[3][4] = {\n        {21, 23, 22, 24},\n        {25, 31, 27, 26},\n        {22, 24, 41, 23},\n    };   // 3 rzędy maszyn, po 4 czujniki\n    int max = temp[0][0], rzad = 0, czujnik = 0;\n"
lv(id=27, title="Hala z czujnikami (tablica 2D)", concept="tablica dwuwymiarowa",
   lesson=["Hala ma 3 rzędy maszyn, w każdym 4 czujniki — takie dane trzyma się w tablicy dwuwymiarowej: `temp[rzad][czujnik]`, jak w arkuszu kalkulacyjnym (wiersz, kolumna).",
           "Przechodzi się po niej dwiema pętlami — jedna w drugiej: zewnętrzna po rzędach, wewnętrzna po czujnikach."],
   example="int t[2][2] = {{1, 5}, {3, 2}};\nprintf(\"%d\\n\", t[0][1]);", exampleOutput="5",
   instructions="Znajdź najwyższą temperaturę i jej miejsce. Wypisz (numeracja od 1, jak dla ludzi): Najgorecej: rzad 3 - czujnik 3 - 41 stopni",
   starterCode=prog(B27 + "    // Dwie pętle: zapamiętaj największą wartość oraz jej rząd i czujnik\n\n    printf(\"Najgorecej: rzad %d - czujnik %d - %d stopni\\n\", rzad + 1, czujnik + 1, max);\n"),
   solution=prog(B27 + "    // Dwie pętle: zapamiętaj największą wartość oraz jej rząd i czujnik\n    for (int r = 0; r < 3; r++) {\n        for (int c = 0; c < 4; c++) {\n            if (temp[r][c] > max) {\n                max = temp[r][c];\n                rzad = r;\n                czujnik = c;\n            }\n        }\n    }\n    printf(\"Najgorecej: rzad %d - czujnik %d - %d stopni\\n\", rzad + 1, czujnik + 1, max);\n"),
   solutionWhere="Pod komentarzem wpisz:", solutionSnippet="for (int r = 0; r < 3; r++) {\n    for (int c = 0; c < 4; c++) {\n        if (temp[r][c] > max) {\n            max = temp[r][c];\n            rzad = r;\n            czujnik = c;\n        }\n    }\n}",
   expectedOutput="Najgorecej: rzad 3 - czujnik 3 - 41 stopni",
   hints=["for (int r = 0; r < 3; r++) { for (int c = 0; c < 4; c++) { ... } }", "if (temp[r][c] > max) { ... }", "W środku zapamiętaj max, rzad = r i czujnik = c."])
T28 = "#define ROZMIAR 4\n"
B28 = "    int bufor[ROZMIAR] = {0, 0, 0, 0};\n    int pozycja = 0;\n    int odczyty[6] = {20, 22, 21, 25, 27, 26};   // kolejne pomiary z czujnika\n    for (int i = 0; i < 6; i++) {\n        bufor[pozycja] = odczyty[i];\n"
E28 = "    }\n    int suma = 0;\n    for (int i = 0; i < ROZMIAR; i++) suma += bufor[i];\n    printf(\"Srednia z 4 ostatnich: %.2f\\n\", (double)suma / ROZMIAR);\n"
lv(id=28, title="Bufor cykliczny", concept="% (modulo), ostatnie pomiary",
   lesson=["Czujnik mierzy bez końca, a pamięci jest mało. Trzyma się więc tylko N ostatnich pomiarów w buforze cyklicznym: po ostatnim miejscu wracasz na początek i nadpisujesz najstarszy pomiar — jak taśma w kółko.",
           "Powrót na początek załatwia reszta z dzielenia: `pozycja = (pozycja + 1) % ROZMIAR;` — po 3 przychodzi 0."],
   example="int p = 3;\np = (p + 1) % 4;\nprintf(\"%d\\n\", p);", exampleOutput="0",
   instructions="Po zapisaniu pomiaru przesuń pozycję o jeden, z powrotem na 0 po końcu bufora. Program wypisze średnią z 4 ostatnich pomiarów.",
   starterCode=prog(B28 + "        // przesuń pozycję (po końcu bufora wróć na 0)\n\n" + E28, top=T28),
   solution=prog(B28 + "        // przesuń pozycję (po końcu bufora wróć na 0)\n        pozycja = (pozycja + 1) % ROZMIAR;\n" + E28, top=T28),
   solutionWhere="W pętli, pod komentarzem, wpisz:", solutionSnippet="pozycja = (pozycja + 1) % ROZMIAR;",
   expectedOutput="Srednia z 4 ostatnich: 24.75", mustMatch=(r"%\s*ROZMIAR", "Wracaj na początek przez % ROZMIAR."),
   hints=["Bez przesuwania wszystko trafia w jedno miejsce.", "pozycja + 1, a potem reszta z dzielenia przez ROZMIAR.", "pozycja = (pozycja + 1) % ROZMIAR;"])
B29 = "    int ceny_gr[3] = {1999, 450, 12000};   // ceny w groszach: 19,99 zł, 4,50 zł, 120,00 zł\n    int razem = 0;\n"
lv(id=29, title="Kasa fiskalna bez ułamków", concept="grosze zamiast ułamków, %02d",
   lesson=["Kasy fiskalne i terminale płatnicze liczą pieniądze w GROSZACH, jako liczby całkowite — nigdy na ułamkach. Ułamki w komputerze nie są dokładne (0.1 + 0.2 ≠ 0.3), a w pieniądzach każdy grosz się liczy.",
           "Do wypisania: złote to `razem / 100`, grosze to `razem % 100`. `%02d` dopisuje zero z przodu: 5 groszy → 05."],
   example="int g = 1205;\nprintf(\"%d.%02d zl\\n\", g / 100, g % 100);", exampleOutput="12.05 zl",
   instructions="Zsumuj ceny w groszach i wypisz: Razem: 144.49 zl",
   starterCode=prog(B29 + "    // zsumuj ceny i wypisz złote i grosze\n\n"),
   solution=prog(B29 + "    // zsumuj ceny i wypisz złote i grosze\n    for (int i = 0; i < 3; i++) razem += ceny_gr[i];\n    printf(\"Razem: %d.%02d zl\\n\", razem / 100, razem % 100);\n"),
   solutionWhere="Pod komentarzem wpisz:", solutionSnippet="for (int i = 0; i < 3; i++) razem += ceny_gr[i];\nprintf(\"Razem: %d.%02d zl\\n\", razem / 100, razem % 100);",
   expectedOutput="Razem: 144.49 zl", mustMatch=(r"%\s*100", "Grosze wylicz przez razem % 100."),
   hints=["for (int i = 0; i < 3; i++) razem += ceny_gr[i];", "Złote: razem / 100, grosze: razem % 100.", "printf(\"Razem: %d.%02d zl\\n\", ...);"])
B30 = "    int napiecia[5] = {3300, 3500, 3700, 3900, 4100};   // miliwolty\n    int procenty[5] = {0, 25, 50, 75, 100};\n    int odczyt = 3800;   // tyle zmierzył układ\n    int wynik = 0;\n"
lv(id=30, title="Wskaźnik baterii (tabela przeliczeń)", concept="tablica przeliczeń",
   lesson=["Telefon nie liczy procentu baterii skomplikowanym wzorem. Ma tabelkę: takie napięcie = tyle procent. Program szuka w tabeli ostatniego progu, który odczyt już przekroczył.",
           "Dwie tablice tej samej długości działają jak dwie kolumny tabeli: `napiecia[i]` i `procenty[i]` to jeden wiersz.",
           "Żeby wypisać znak procentu, w printf pisze się `%%`."],
   example="if (odczyt >= napiecia[2]) wynik = procenty[2];", exampleOutput="(wynik = 50, gdy odczyt jest co najmniej 3700)",
   instructions="Przejdź po tabeli i zapamiętaj procent ostatniego progu, który odczyt osiąga. Wypisz: Bateria: 50%",
   starterCode=prog(B30 + "    // znajdź ostatni próg, który odczyt osiąga\n\n    printf(\"Bateria: %d%%\\n\", wynik);\n"),
   solution=prog(B30 + "    // znajdź ostatni próg, który odczyt osiąga\n    for (int i = 0; i < 5; i++) {\n        if (odczyt >= napiecia[i]) wynik = procenty[i];\n    }\n    printf(\"Bateria: %d%%\\n\", wynik);\n"),
   solutionWhere="Pod komentarzem wpisz:", solutionSnippet="for (int i = 0; i < 5; i++) {\n    if (odczyt >= napiecia[i]) wynik = procenty[i];\n}",
   expectedOutput="Bateria: 50%",
   hints=["Pętla po 5 progach.", "if (odczyt >= napiecia[i]) wynik = procenty[i];", "3800 przekracza progi 3300, 3500 i 3700 — ostatni z nich daje 50%."])

# ---------------- 31-50: sprawdź kod od AI ----------------
LESSON_AI = "Od teraz kod pisze za ciebie asystent AI, a ty jesteś kontrolerem jakości. W C to szczególnie ważne: błąd w sterowniku hamulców czy rozruszniku serca to nie biały ekran, tylko realne niebezpieczeństwo."
R31 = "    int odczyty[5] = {21, 22, 23, 22, 24};\n    int suma = 0;\n"
ai(id=31, title="Jeden pomiar za daleko", concept="wyjście poza tablicę",
   lesson=[LESSON_AI, "Najczęstszy błąd w C: pętla `i <= 5` przy tablicy z 5 miejscami (0–4) sięga po nieistniejące szóste. Ta gra to zatrzyma, ale prawdziwe C NIE — przeczyta albo nadpisze cudzą pamięć i pojedzie dalej. Tak powstają najgroźniejsze błędy."],
   example="int t[3] = {1, 2, 3};\nfor (int i = 0; i < 3; i++) printf(\"%d\", t[i]);", exampleOutput="123",
   instructions="Uruchom, przeczytaj błąd i popraw pętlę. Wynik: Srednia: 22.4",
   starterCode=prog(R31 + AI + "    // Prośba: \"policz średnią z 5 pomiarów\"\n    for (int i = 0; i <= 5; i++) {\n        suma += odczyty[i];\n    }\n    printf(\"Srednia: %.1f\\n\", (double)suma / 5);\n"),
   solution=prog(R31 + AI + "    // Prośba: \"policz średnią z 5 pomiarów\"\n    for (int i = 0; i < 5; i++) {\n        suma += odczyty[i];\n    }\n    printf(\"Srednia: %.1f\\n\", (double)suma / 5);\n"),
   solutionWhere="Zamień linijkę z for na:", solutionSnippet="for (int i = 0; i < 5; i++) {",
   expectedOutput="Srednia: 22.4", mustMatch=(r"i\s*<\s*5", "Pętla po 5 elementach: i < 5."),
   hints=["Błąd mówi o indeksie 5 — a tablica ma miejsca 0–4.", "<= sięga o jeden za daleko.", "Zamień <= na <."])
ai(id=32, title="Alarm, który zawsze wyje", concept="= zamiast ==",
   lesson=[LESSON_AI, "`=` wpisuje wartość, `==` porównuje. `if (temperatura = 100)` nie sprawdza temperatury — WPISUJE 100 i uznaje to za prawdę. Alarm wyje zawsze, a do tego zmienna została zepsuta.",
           "Program działa i nic nie zgłasza — dlatego ten błąd jest tak podstępny. Prawdziwe kompilatory dają za to tylko ostrzeżenie, które łatwo przeoczyć."],
   example="int x = 5;\nif (x == 5) printf(\"rowne\\n\");", exampleOutput="rowne",
   instructions="Temperatura to 70, a alarm wyje. Popraw warunek. Wynik: Temperatura w normie",
   starterCode=prog("    int temperatura = 70;\n" + AI + "    // Prośba: \"włącz alarm, gdy temperatura dojdzie do 100\"\n    if (temperatura = 100) {\n        printf(\"ALARM: przegrzanie!\\n\");\n    } else {\n        printf(\"Temperatura w normie\\n\");\n    }\n"),
   solution=prog("    int temperatura = 70;\n" + AI + "    // Prośba: \"włącz alarm, gdy temperatura dojdzie do 100\"\n    if (temperatura >= 100) {\n        printf(\"ALARM: przegrzanie!\\n\");\n    } else {\n        printf(\"Temperatura w normie\\n\");\n    }\n"),
   solutionWhere="Zamień linijkę z if na:", solutionSnippet="if (temperatura >= 100) {",
   expectedOutput="Temperatura w normie", mustMatch=(r"temperatura\s*(==|>=)\s*100", "Porównuj: temperatura >= 100 (albo ==), a nie przypisuj ="),
   hints=["Jeden znak = wpisuje, nie porównuje.", "„Dojdzie do 100” to: 100 albo więcej.", "if (temperatura >= 100)"])
SW33 = "    int komenda = 1;   // 1 = start, 2 = stop, 3 = reset\n"
ai(id=33, title="Zapomniany break", concept="switch bez break",
   lesson=[LESSON_AI, "W `switch` po każdym `case` musi być `break`. Bez niego program „przelatuje” do następnego case i wykonuje też jego kod. AI zapomniało break po starcie — więc silnik startuje i od razu się zatrzymuje."],
   example="switch (x) {\n    case 1: printf(\"jeden\\n\"); break;\n    case 2: printf(\"dwa\\n\"); break;\n}", exampleOutput="(tylko jedno słowo)",
   instructions="Komenda 1 ma tylko uruchomić silnik. Popraw. Wynik: Start silnika",
   starterCode=prog(SW33 + AI + "    // Prośba: \"obsłuż komendy start, stop, reset\"\n    switch (komenda) {\n        case 1:\n            printf(\"Start silnika\\n\");\n        case 2:\n            printf(\"Stop silnika\\n\");\n            break;\n        case 3:\n            printf(\"Reset\\n\");\n            break;\n    }\n"),
   solution=prog(SW33 + AI + "    // Prośba: \"obsłuż komendy start, stop, reset\"\n    switch (komenda) {\n        case 1:\n            printf(\"Start silnika\\n\");\n            break;\n        case 2:\n            printf(\"Stop silnika\\n\");\n            break;\n        case 3:\n            printf(\"Reset\\n\");\n            break;\n    }\n"),
   solutionWhere="Po linijce printf(\"Start silnika\\n\"); dopisz:", solutionSnippet="break;",
   expectedOutput="Start silnika", hints=["Po starcie wypisuje się też Stop — dlaczego?", "Każdy case kończy się break;", "Dopisz break; po printf ze Start silnika."])
ai(id=34, title="Średnia bez przecinka", concept="dzielenie liczb całkowitych",
   lesson=[LESSON_AI, "W C dzielenie dwóch liczb całkowitych ucina część po przecinku: `47 / 2` to 23, nie 23.5. Wpisanie wyniku do `double` nie pomoże — ucięcie już nastąpiło.",
           "Trzeba zamienić przynajmniej jedną liczbę na ułamkową PRZED dzieleniem: `(double)suma / n`."],
   example="printf(\"%.1f\\n\", (double)7 / 2);", exampleOutput="3.5",
   instructions="Średnia wychodzi 23.0 zamiast 23.5. Popraw. Wynik: Srednia: 23.5",
   starterCode=prog("    int suma = 47;\n    int pomiary = 2;\n" + AI + "    // Prośba: \"policz dokładną średnią\"\n    double srednia = suma / pomiary;\n    printf(\"Srednia: %.1f\\n\", srednia);\n"),
   solution=prog("    int suma = 47;\n    int pomiary = 2;\n" + AI + "    // Prośba: \"policz dokładną średnią\"\n    double srednia = (double)suma / pomiary;\n    printf(\"Srednia: %.1f\\n\", srednia);\n"),
   solutionWhere="Zamień linijkę z double srednia na:", solutionSnippet="double srednia = (double)suma / pomiary;",
   expectedOutput="Srednia: 23.5", mustMatch=(r"\(double\)", "Zamień na ułamek przed dzieleniem: (double)suma / pomiary."),
   hints=["47 / 2 w liczbach całkowitych to 23.", "Ułamek musi być PRZED dzieleniem.", "(double)suma / pomiary"])
ai(id=35, title="Zmienna ze śmieciami", concept="niezainicjowana zmienna",
   lesson=[LESSON_AI, "W C nowa zmienna NIE jest automatycznie zerem — ma w sobie to, co akurat leżało w pamięci. AI zadeklarowało `int suma;` i od razu do niej dodaje. Ta gra zatrzyma program, ale prawdziwe C policzy sumę od przypadkowej liczby — za każdym razem innej."],
   example="int licznik = 0;   // zawsze nadawaj wartość na start", exampleOutput="(licznik zaczyna od 0)",
   instructions="Uruchom, przeczytaj błąd i popraw. Wynik: Suma: 112",
   starterCode=prog("    int odczyty[5] = {21, 22, 23, 22, 24};\n" + AI + "    // Prośba: \"zsumuj pomiary\"\n    int suma;\n    for (int i = 0; i < 5; i++) {\n        suma += odczyty[i];\n    }\n    printf(\"Suma: %d\\n\", suma);\n"),
   solution=prog("    int odczyty[5] = {21, 22, 23, 22, 24};\n" + AI + "    // Prośba: \"zsumuj pomiary\"\n    int suma = 0;\n    for (int i = 0; i < 5; i++) {\n        suma += odczyty[i];\n    }\n    printf(\"Suma: %d\\n\", suma);\n"),
   solutionWhere="Zamień linijkę int suma; na:", solutionSnippet="int suma = 0;",
   expectedOutput="Suma: 112", mustMatch=(r"int\s+suma\s*=\s*0", "Nadaj sumie wartość startową: int suma = 0;"),
   hints=["Błąd mówi o wartości, której nikt nie ustawił.", "Od czego zaczyna się liczenie sumy?", "int suma = 0;"])
ai(id=36, title="Licznik się przekręcił", concept="przepełnienie typu",
   lesson=[LESSON_AI, "`unsigned char` mieści liczby tylko od 0 do 255 (jeden bajt). AI wybrało go na licznik sztuk, „żeby oszczędzić pamięć”. Po 255 sztukach licznik się przekręca — prawdziwe C po cichu zacznie od zera i raport pokaże 44 zamiast 300.",
           "Do liczenia czegoś, co może przekroczyć 255, używa się `int`."],
   example="int licznik = 0;   // mieści ponad 2 miliardy", exampleOutput="(bez przekręcania)",
   instructions="Maszyna wyprodukowała 300 sztuk. Popraw typ licznika. Wynik: Wyprodukowano: 300 sztuk",
   starterCode=prog(AI + "    // Prośba: \"policz wyprodukowane sztuki\"\n    unsigned char licznik = 0;\n    for (int i = 0; i < 300; i++) {\n        licznik++;\n    }\n    printf(\"Wyprodukowano: %d sztuk\\n\", licznik);\n"),
   solution=prog(AI + "    // Prośba: \"policz wyprodukowane sztuki\"\n    int licznik = 0;\n    for (int i = 0; i < 300; i++) {\n        licznik++;\n    }\n    printf(\"Wyprodukowano: %d sztuk\\n\", licznik);\n"),
   solutionWhere="Zamień linijkę z unsigned char na:", solutionSnippet="int licznik = 0;",
   expectedOutput="Wyprodukowano: 300 sztuk", mustMatch=(r"int\s+licznik", "Licznik musi być typu int."),
   hints=["unsigned char mieści tylko 0–255.", "300 się nie zmieści.", "int licznik = 0;"])
T37 = "#define BLAD_TEMP     0x01\n#define BLAD_CZUJNIKA 0x04\n"
ai(id=37, title="Podwójny ampersand", concept="&& zamiast &",
   lesson=[LESSON_AI, "`&&` to logiczne „i” (czy oba są prawdą), a `&` sprawdza bity. AI pomyliło je przy sprawdzaniu flagi: `status && BLAD_CZUJNIKA` to prawda, gdy JAKIKOLWIEK błąd jest zgłoszony — więc każdy drobiazg wygląda jak awaria czujnika."],
   example="if (status & BLAD_CZUJNIKA) ...   // sprawdza jeden bit", exampleOutput="(tylko ten konkretny błąd)",
   instructions="Zgłoszony jest tylko błąd temperatury, a program krzyczy o czujniku. Popraw. Wynik: Czujnik OK",
   starterCode=prog("    unsigned char status = BLAD_TEMP;   // tylko błąd temperatury\n" + AI + "    // Prośba: \"sprawdź, czy czujnik jest uszkodzony\"\n    if (status && BLAD_CZUJNIKA) {\n        printf(\"Awaria czujnika!\\n\");\n    } else {\n        printf(\"Czujnik OK\\n\");\n    }\n", top=T37),
   solution=prog("    unsigned char status = BLAD_TEMP;   // tylko błąd temperatury\n" + AI + "    // Prośba: \"sprawdź, czy czujnik jest uszkodzony\"\n    if (status & BLAD_CZUJNIKA) {\n        printf(\"Awaria czujnika!\\n\");\n    } else {\n        printf(\"Czujnik OK\\n\");\n    }\n", top=T37),
   solutionWhere="Zamień linijkę z if na:", solutionSnippet="if (status & BLAD_CZUJNIKA) {",
   expectedOutput="Czujnik OK", mustMatch=(r"status\s*&(?!&)\s*BLAD_CZUJNIKA", "Bit sprawdza się pojedynczym &: status & BLAD_CZUJNIKA."),
   hints=["&& pyta: czy oba są niezerowe?", "Do bitów służy pojedynczy &.", "if (status & BLAD_CZUJNIKA)"])
ai(id=38, title="Diody od jedynki", concept="numeracja bitów",
   lesson=[LESSON_AI, "Dokumentacja panelu numeruje diody od 1 do 8, ale bity liczy się od 0 do 7. Dioda nr 1 to bit 0, a dioda nr 8 to bit 7. AI wzięło numery z dokumentacji wprost — i sięga po bit 8, którego w bajcie nie ma."],
   example="// dioda nr 1 (dokumentacja) = bit 0\nd = d | (1 << 0);", exampleOutput="(pierwsza dioda)",
   instructions="Zapal diody nr 1 i nr 8 według dokumentacji (diody 1–8 = bity 0–7). Wynik: Diody: 0x81",
   starterCode=prog("    unsigned char diody = 0;   // dokumentacja: diody numerowane 1-8\n" + AI + "    // Prośba: \"zapal diodę nr 1 i nr 8\"\n    diody = diody | (1 << 1);\n    diody = diody | (1 << 8);\n    printf(\"Diody: 0x%02X\\n\", diody);\n"),
   solution=prog("    unsigned char diody = 0;   // dokumentacja: diody numerowane 1-8\n" + AI + "    // Prośba: \"zapal diodę nr 1 i nr 8\"\n    diody = diody | (1 << 0);\n    diody = diody | (1 << 7);\n    printf(\"Diody: 0x%02X\\n\", diody);\n"),
   solutionWhere="Zamień dwie linijki z diody | na:", solutionSnippet="diody = diody | (1 << 0);\ndiody = diody | (1 << 7);",
   expectedOutput="Diody: 0x81", hints=["Bajt ma bity 0–7. Bitu 8 nie ma.", "Dioda nr 1 = bit 0, dioda nr 8 = bit 7.", "(1 << 0) i (1 << 7)"])
ai(id=39, title="Funkcja z Windowsa", concept="halucynacja: strrev",
   lesson=[LESSON_AI, "AI użyło `strrev()` do odwrócenia tekstu. Taka funkcja istnieje tylko w niektórych kompilatorach na Windows — w standardowym C jej nie ma. Kod działał „u AI”, a na sterowniku się nie kompiluje.",
           "Odwrócić tekst można samemu: pętla od ostatniego znaku (`strlen(s) - 1`) do pierwszego."],
   example="for (int i = 2; i >= 0; i--) printf(\"%c\", \"abc\"[i]);", exampleOutput="cba",
   instructions="Wyświetlacz ma pokazać numer seryjny od tyłu. Zastąp strrev własną pętlą. Wynik: 54321-NS",
   starterCode=prog("    char numer[] = \"SN-12345\";\n" + AI + "    // Prośba: \"wypisz numer seryjny od tyłu\"\n    strrev(numer);\n    printf(\"%s\\n\", numer);\n", includes=("stdio.h", "string.h")),
   solution=prog("    char numer[] = \"SN-12345\";\n" + AI + "    // Prośba: \"wypisz numer seryjny od tyłu\"\n    for (int i = strlen(numer) - 1; i >= 0; i--) {\n        printf(\"%c\", numer[i]);\n    }\n    printf(\"\\n\");\n", includes=("stdio.h", "string.h")),
   solutionWhere="Zamień dwie linijki (strrev i printf) na:", solutionSnippet="for (int i = strlen(numer) - 1; i >= 0; i--) {\n    printf(\"%c\", numer[i]);\n}\nprintf(\"\\n\");",
   expectedOutput="54321-NS", mustMatch=(r"^(?![\s\S]*strrev\()", "Usuń strrev — w standardowym C tej funkcji nie ma."),
   hints=["Błąd mówi, że strrev nie istnieje.", "Pętla od strlen(numer) - 1 w dół do 0.", "W środku printf(\"%c\", numer[i]);"])
ai(id=40, title="Python w środku C", concept="halucynacja: len()",
   lesson=[LESSON_AI, "AI zna wiele języków i czasem je miesza. `len(napis)` to Python — w C długość tekstu daje `strlen(napis)` z biblioteki string.h."],
   example="#include <string.h>\nprintf(\"%d\\n\", (int)strlen(\"abc\"));", exampleOutput="3",
   instructions="Uruchom, przeczytaj błąd i popraw na prawdziwe C. Wynik: Dlugosc: 8",
   starterCode=prog("    char model[] = \"PRALKA-7\";\n" + AI + "    // Prośba: \"podaj długość nazwy modelu\"\n    int dlugosc = len(model);\n    printf(\"Dlugosc: %d\\n\", dlugosc);\n", includes=("stdio.h", "string.h")),
   solution=prog("    char model[] = \"PRALKA-7\";\n" + AI + "    // Prośba: \"podaj długość nazwy modelu\"\n    int dlugosc = strlen(model);\n    printf(\"Dlugosc: %d\\n\", dlugosc);\n", includes=("stdio.h", "string.h")),
   solutionWhere="Zamień linijkę z len na:", solutionSnippet="int dlugosc = strlen(model);",
   expectedOutput="Dlugosc: 8", mustMatch=(r"strlen\(", "W C długość tekstu to strlen(...)."),
   hints=["len nie istnieje w C.", "W string.h jest funkcja strlen.", "int dlugosc = strlen(model);"])
T41 = "// --- biblioteka firmy (nie ruszaj): porównuje dwa teksty znak po znaku ---\nint takie_same(char a[], char b[]) {\n    int i = 0;\n    while (a[i] != '\\0' && a[i] == b[i]) i++;\n    return a[i] == b[i];\n}\n"
ai(id=41, title="Hasło porównane przez ==", concept="porównywanie tekstów",
   lesson=[LESSON_AI, "W C `tekst1 == tekst2` nie porównuje liter — porównuje ADRESY w pamięci, pod którymi leżą teksty. Dwa takie same hasła w różnych miejscach są „różne”. Teksty porównuje się znak po znaku (w standardowym C robi to strcmp, w firmie jest gotowa funkcja takie_same)."],
   example="if (takie_same(a, \"tak\")) printf(\"rowne\\n\");", exampleOutput="rowne",
   instructions="Serwisant wpisał dobre hasło, a urządzenie odmawia. Użyj funkcji takie_same. Wynik: Dostep serwisowy",
   starterCode=prog("    char wpisane[] = \"serwis2026\";   // to wpisał serwisant\n" + AI + "    // Prośba: \"sprawdź hasło serwisowe\"\n    if (wpisane == \"serwis2026\") {\n        printf(\"Dostep serwisowy\\n\");\n    } else {\n        printf(\"Odmowa\\n\");\n    }\n", top=T41),
   solution=prog("    char wpisane[] = \"serwis2026\";   // to wpisał serwisant\n" + AI + "    // Prośba: \"sprawdź hasło serwisowe\"\n    if (takie_same(wpisane, \"serwis2026\")) {\n        printf(\"Dostep serwisowy\\n\");\n    } else {\n        printf(\"Odmowa\\n\");\n    }\n", top=T41),
   solutionWhere="Zamień linijkę z if na:", solutionSnippet="if (takie_same(wpisane, \"serwis2026\")) {",
   expectedOutput="Dostep serwisowy", mustMatch=(r"takie_same\(", "Porównaj teksty funkcją takie_same(...)."),
   hints=["== na tekstach porównuje adresy, nie litery.", "Firma ma gotową funkcję takie_same(a, b).", "if (takie_same(wpisane, \"serwis2026\"))"])
T42 = T41 + "// --- pamięć urządzenia (nie ruszaj): każde ma własne hasło z fabryki ---\nchar haslo_z_pamieci[] = \"K7x-93qP\";\n"
B42 = "    char proby[2][12] = {\"admin\", \"K7x-93qP\"};   // dwie próby logowania\n"
ai(id=42, title="Jedno hasło na wszystkie urządzenia", concept="bezpieczeństwo: hasło w firmware",
   lesson=[LESSON_AI, "Bezpieczeństwo: AI wpisało w program jedno hasło „admin” dla wszystkich urządzeń. Wystarczy, że ktoś rozbierze jedno urządzenie albo znajdzie hasło w internecie — i otwiera wszystkie na świecie. Tak powstały botnety z milionów kamer i routerów.",
           "Każde urządzenie powinno mieć własne hasło, zapisane w jego pamięci przy produkcji."],
   example="if (takie_same(proba, haslo_z_pamieci)) ...", exampleOutput="(hasło inne dla każdego urządzenia)",
   instructions="Sprawdzaj hasło z pamięci urządzenia (haslo_z_pamieci), a nie wpisane na sztywno. Wynik: admin: odmowa / K7x-93qP: dostep",
   starterCode=prog(B42 + AI + "    // Prośba: \"sprawdzaj hasło przy logowaniu\"\n    for (int i = 0; i < 2; i++) {\n        if (takie_same(proby[i], \"admin\")) printf(\"%s: dostep\\n\", proby[i]);\n        else printf(\"%s: odmowa\\n\", proby[i]);\n    }\n", top=T42),
   solution=prog(B42 + AI + "    // Prośba: \"sprawdzaj hasło przy logowaniu\"\n    for (int i = 0; i < 2; i++) {\n        if (takie_same(proby[i], haslo_z_pamieci)) printf(\"%s: dostep\\n\", proby[i]);\n        else printf(\"%s: odmowa\\n\", proby[i]);\n    }\n", top=T42),
   solutionWhere="W pętli zamień linijkę z if na:", solutionSnippet="if (takie_same(proby[i], haslo_z_pamieci)) printf(\"%s: dostep\\n\", proby[i]);",
   expectedOutput="admin: odmowa\nK7x-93qP: dostep", mustMatch=(r"^(?![\s\S]*\"admin\"\)\))[\s\S]*haslo_z_pamieci\)", "Sprawdzaj hasło z pamięci urządzenia: takie_same(proby[i], haslo_z_pamieci)."),
   hints=["Hasło „admin” jest takie samo na każdym urządzeniu.", "Porównuj z haslo_z_pamieci.", "takie_same(proby[i], haslo_z_pamieci)"])
ai(id=43, title="Nazwa z procentem", concept="bezpieczeństwo: printf(tekst)",
   lesson=[LESSON_AI, "Bezpieczeństwo: AI wypisało tekst od użytkownika wprost: `printf(nazwa);`. Jeśli użytkownik wpisze w nazwę `%d`, printf potraktuje to jak polecenie i sięgnie po dane, których nie ma — hakerzy tak odczytują pamięć urządzeń. Tekst od użytkownika ZAWSZE wypisuje się przez `printf(\"%s\", nazwa)`."],
   example="char n[] = \"100%d\";\nprintf(\"%s\\n\", n);", exampleOutput="100%d",
   instructions="Użytkownik nazwał urządzenie „Piec %d”. Popraw wypisywanie. Wynik: Urzadzenie: Piec %d",
   starterCode=prog("    char nazwa[] = \"Piec %d\";   // nazwę wpisał użytkownik w aplikacji\n" + AI + "    // Prośba: \"wypisz nazwę urządzenia\"\n    printf(\"Urzadzenie: \");\n    printf(nazwa);\n    printf(\"\\n\");\n"),
   solution=prog("    char nazwa[] = \"Piec %d\";   // nazwę wpisał użytkownik w aplikacji\n" + AI + "    // Prośba: \"wypisz nazwę urządzenia\"\n    printf(\"Urzadzenie: \");\n    printf(\"%s\", nazwa);\n    printf(\"\\n\");\n"),
   solutionWhere="Zamień linijkę printf(nazwa); na:", solutionSnippet="printf(\"%s\", nazwa);",
   expectedOutput="Urzadzenie: Piec %d", mustMatch=(r"printf\(\s*\"%s\"\s*,\s*nazwa\s*\)", "Wypisuj tekst użytkownika przez printf(\"%s\", nazwa)."),
   hints=["Błąd mówi, że printf chce danych do %d.", "Tekst od użytkownika nie może być pierwszym argumentem printf.", "printf(\"%s\", nazwa);"])
ai(id=44, title="Za długa wiadomość z sieci", concept="bezpieczeństwo: przepełnienie bufora",
   lesson=[LESSON_AI, "Najsłynniejsza dziura w historii C: przepełnienie bufora. Bufor ma 8 miejsc, a AI kopiuje wiadomość z sieci aż do jej końca, nie patrząc na rozmiar. Haker wysyła za długą wiadomość — w prawdziwym C nadmiar nadpisuje sąsiednią pamięć, czasem nawet kod programu.",
           "Kopiując, zawsze pilnuj miejsca: najwyżej 7 znaków + kończące zero `'\\0'`."],
   example="while (wej[i] != '\\0' && i < 7) { buf[i] = wej[i]; i++; }\nbuf[i] = '\\0';", exampleOutput="(co najwyżej 7 znaków)",
   instructions="Popraw kopiowanie tak, żeby nie wyszło poza bufor (max 7 znaków + '\\0'). Wynik: Odebrano: KOMENDA",
   starterCode=prog("    char wiadomosc[] = \"KOMENDA_ZA_DLUGA_ATAK\";   // przyszło z sieci\n    char bufor[8];\n    int i = 0;\n" + AI + "    // Prośba: \"skopiuj komendę do bufora\"\n    while (wiadomosc[i] != '\\0') {\n        bufor[i] = wiadomosc[i];\n        i++;\n    }\n    bufor[i] = '\\0';\n    printf(\"Odebrano: %s\\n\", bufor);\n"),
   solution=prog("    char wiadomosc[] = \"KOMENDA_ZA_DLUGA_ATAK\";   // przyszło z sieci\n    char bufor[8];\n    int i = 0;\n" + AI + "    // Prośba: \"skopiuj komendę do bufora\"\n    while (wiadomosc[i] != '\\0' && i < 7) {\n        bufor[i] = wiadomosc[i];\n        i++;\n    }\n    bufor[i] = '\\0';\n    printf(\"Odebrano: %s\\n\", bufor);\n"),
   solutionWhere="Zamień linijkę z while na:", solutionSnippet="while (wiadomosc[i] != '\\0' && i < 7) {",
   expectedOutput="Odebrano: KOMENDA", mustMatch=(r"i\s*<\s*7", "Pilnuj rozmiaru bufora: i < 7."),
   hints=["Błąd mówi o indeksie 8 — bufor ma miejsca 0–7.", "Kopiuj tylko, dopóki i < 7 (ósme miejsce na '\\0').", "while (wiadomosc[i] != '\\0' && i < 7)"])
ai(id=45, title="Kanał numer minus jeden", concept="bezpieczeństwo: walidacja indeksu",
   lesson=[LESSON_AI, "Numer kanału przychodzi z aplikacji w telefonie — czyli od kogokolwiek. AI użyło go wprost jako indeksu tablicy. Ktoś wysłał -1 i program sięga po pamięć PRZED tablicą. Dane z zewnątrz zawsze się sprawdza: czy mieszczą się w zakresie 0..N-1."],
   example="if (k < 0 || k >= 4) printf(\"Bledny kanal\\n\");", exampleOutput="(odrzucenie złej wartości)",
   instructions="Gdy kanał jest spoza zakresu 0–3, wypisz: Bledny kanal: -1 (zamiast sięgać do tablicy).",
   starterCode=prog("    int glosnosc[4] = {10, 20, 30, 40};\n    int kanal = -1;   // przyszło z aplikacji w telefonie\n" + AI + "    // Prośba: \"pokaż głośność wybranego kanału\"\n    printf(\"Glosnosc: %d\\n\", glosnosc[kanal]);\n"),
   solution=prog("    int glosnosc[4] = {10, 20, 30, 40};\n    int kanal = -1;   // przyszło z aplikacji w telefonie\n" + AI + "    // Prośba: \"pokaż głośność wybranego kanału\"\n    if (kanal < 0 || kanal >= 4) {\n        printf(\"Bledny kanal: %d\\n\", kanal);\n    } else {\n        printf(\"Glosnosc: %d\\n\", glosnosc[kanal]);\n    }\n"),
   solutionWhere="Zamień linijkę z printf na:", solutionSnippet="if (kanal < 0 || kanal >= 4) {\n    printf(\"Bledny kanal: %d\\n\", kanal);\n} else {\n    printf(\"Glosnosc: %d\\n\", glosnosc[kanal]);\n}",
   expectedOutput="Bledny kanal: -1", mustMatch=(r"kanal\s*<\s*0", "Sprawdź zakres: kanal < 0 || kanal >= 4."),
   hints=["Dobre numery kanałów to 0, 1, 2, 3.", "if (kanal < 0 || kanal >= 4) { ... } else { ... }", "W pierwszej części: printf(\"Bledny kanal: %d\\n\", kanal);"])
ai(id=46, title="Za duża liczba", concept="przepełnienie przy mnożeniu",
   lesson=[LESSON_AI, "Prośba była o milisekundy, a AI dorzuciło jeszcze jedno `* 1000` (mikrosekundy). Wynik — 3 miliardy — nie mieści się w `int` (najwyżej ok. 2,1 mld). Prawdziwe C po cichu dałoby liczbę ujemną.",
           "To nie teoria: w 2015 roku okazało się, że Boeing 787 po 248 dniach ciągłej pracy tracił zasilanie właśnie przez przepełniony licznik czasu."],
   example="int ms = 3000 * 1000;   // 3 000 000 — mieści się", exampleOutput="3000000",
   instructions="Przelicz czas pracy z sekund na MILISEKUNDY. Wynik: Czas pracy: 3000000 ms",
   starterCode=prog("    int sekundy = 3000;\n" + AI + "    // Prośba: \"czas pracy w milisekundach\"\n    int czas = sekundy * 1000 * 1000;\n    printf(\"Czas pracy: %d ms\\n\", czas);\n"),
   solution=prog("    int sekundy = 3000;\n" + AI + "    // Prośba: \"czas pracy w milisekundach\"\n    int czas = sekundy * 1000;\n    printf(\"Czas pracy: %d ms\\n\", czas);\n"),
   solutionWhere="Zamień linijkę int czas = ... na:", solutionSnippet="int czas = sekundy * 1000;",
   expectedOutput="Czas pracy: 3000000 ms", hints=["1 sekunda to 1000 milisekund.", "AI pomnożyło dwa razy przez 1000 — to już mikrosekundy.", "int czas = sekundy * 1000;"])
ai(id=47, title="Odliczanie w nieskończoność", concept="unsigned w pętli w dół",
   lesson=[LESSON_AI, "`unsigned` znaczy „bez minusa” — taka liczba nigdy nie jest ujemna. AI odlicza w dół pętlą `for (unsigned int i = 4; i >= 0; i--)`. Warunek `i >= 0` jest ZAWSZE prawdziwy, a po zerze prawdziwe C robi z i ponad 4 miliardy — pętla nigdy się nie kończy i urządzenie się zawiesza.",
           "Do odliczania do zera używaj zwykłego `int`."],
   example="for (int i = 2; i >= 0; i--) printf(\"%d \", i);", exampleOutput="2 1 0",
   instructions="Uruchom, przeczytaj błąd i popraw licznik. Wynik: 4 3 2 1 0 START",
   starterCode=prog(AI + "    // Prośba: \"odliczanie od 4 do 0 przed startem\"\n    for (unsigned int i = 4; i >= 0; i--) {\n        printf(\"%u \", i);\n    }\n    printf(\"START\\n\");\n"),
   solution=prog(AI + "    // Prośba: \"odliczanie od 4 do 0 przed startem\"\n    for (int i = 4; i >= 0; i--) {\n        printf(\"%d \", i);\n    }\n    printf(\"START\\n\");\n"),
   solutionWhere="Zamień dwie linijki (for i printf w środku) na:", solutionSnippet="for (int i = 4; i >= 0; i--) {\n    printf(\"%d \", i);",
   expectedOutput="4 3 2 1 0 START", mustMatch=(r"for\s*\(\s*int\s+i", "Odliczaj na zwykłym int."),
   hints=["Błąd mówi, że licznik zszedł poniżej zera.", "unsigned nie zna minusa — i >= 0 zawsze jest prawdą.", "for (int i = 4; i >= 0; i--) i printf z %d."])
ai(id=48, title="Pomylone jednostki", concept="dokumentacja czujnika",
   lesson=[LESSON_AI, "Czujnik podaje temperaturę w DZIESIĄTYCH stopnia (235 = 23.5 stopnia) — tak jest w jego dokumentacji. AI tego nie doczytało i porównuje 235 z progiem 30 stopni. Alarm co chwilę, a ludzie przestają mu ufać.",
           "Pomylone jednostki to prawdziwa katastrofa: w 1999 roku sonda Mars Climate Orbiter (125 mln dolarów) rozbiła się, bo jeden zespół liczył w funtach, a drugi w niutonach."],
   example="int t = 235;   // dziesiąte stopnia\nprintf(\"%d.%d\\n\", t / 10, t % 10);", exampleOutput="23.5",
   instructions="Próg 30 stopni to 300 w jednostkach czujnika. Popraw porównanie i wypisywanie. Wynik: Temperatura: 23.5 C - OK",
   starterCode=prog("    int odczyt = 235;   // dokumentacja czujnika: wynik w dziesiątych stopnia\n" + AI + "    // Prośba: \"alarm powyżej 30 stopni\"\n    if (odczyt > 30) {\n        printf(\"ALARM: %d stopni!\\n\", odczyt);\n    } else {\n        printf(\"Temperatura: %d C - OK\\n\", odczyt);\n    }\n"),
   solution=prog("    int odczyt = 235;   // dokumentacja czujnika: wynik w dziesiątych stopnia\n" + AI + "    // Prośba: \"alarm powyżej 30 stopni\"\n    if (odczyt > 300) {\n        printf(\"ALARM: %d.%d stopni!\\n\", odczyt / 10, odczyt % 10);\n    } else {\n        printf(\"Temperatura: %d.%d C - OK\\n\", odczyt / 10, odczyt % 10);\n    }\n"),
   solutionWhere="Zamień próg na 300, a wypisywanie na stopnie z ułamkiem:", solutionSnippet="if (odczyt > 300) {\n    printf(\"ALARM: %d.%d stopni!\\n\", odczyt / 10, odczyt % 10);\n} else {\n    printf(\"Temperatura: %d.%d C - OK\\n\", odczyt / 10, odczyt % 10);\n}",
   expectedOutput="Temperatura: 23.5 C - OK", mustMatch=(r">\s*300", "Próg 30 stopni to 300 dziesiątych."),
   hints=["235 to 23.5 stopnia, a nie 235.", "Próg 30 stopni = 300.", "Wypisz odczyt / 10 i odczyt % 10 z kropką pomiędzy."])
B49 = "    int surowe[2] = {512, 498};       // odczyty dwóch czujników\n    int poprawka[2] = {-12, 7};       // kalibracja z fabryki, osobna dla każdego\n"
ai(id=49, title="Kopiuj-wklej z innego czujnika", concept="kopiuj-wklej, zły indeks",
   lesson=[LESSON_AI, "AI napisało kod dla pierwszego czujnika, a potem go skopiowało dla drugiego — i nie poprawiło wszystkich numerów. Drugi czujnik dostał poprawkę kalibracyjną pierwszego. Kod wygląda porządnie, wynik jest zły.",
           "Przy kopiowanych linijkach zawsze sprawdź KAŻDY numer i nazwę."],
   example="wynik[1] = surowe[1] + poprawka[1];   // wszystkie indeksy takie same", exampleOutput="(dane drugiego czujnika)",
   instructions="Popraw kalibrację drugiego czujnika. Wynik: Czujnik 1: 500 / Czujnik 2: 505",
   starterCode=prog(B49 + AI + "    // Prośba: \"skalibruj oba czujniki\"\n    printf(\"Czujnik 1: %d\\n\", surowe[0] + poprawka[0]);\n    printf(\"Czujnik 2: %d\\n\", surowe[1] + poprawka[0]);\n"),
   solution=prog(B49 + AI + "    // Prośba: \"skalibruj oba czujniki\"\n    printf(\"Czujnik 1: %d\\n\", surowe[0] + poprawka[0]);\n    printf(\"Czujnik 2: %d\\n\", surowe[1] + poprawka[1]);\n"),
   solutionWhere="Zamień linijkę dla czujnika 2 na:", solutionSnippet="printf(\"Czujnik 2: %d\\n\", surowe[1] + poprawka[1]);",
   expectedOutput="Czujnik 1: 500\nCzujnik 2: 505", hints=["Porównaj indeksy w linijce czujnika 2.", "Drugi czujnik ma poprawkę poprawka[1].", "surowe[1] + poprawka[1]"])
B50 = "    int pomiary[5] = {21, 22, 23, 22, 24};\n"
ai(id=50, title="Wielki finał: sterownik pieca", concept="trzy błędy naraz",
   lesson=["Wielki finał gry! AI napisało fragment sterownika pieca: średnia temperatura z 5 czujników. Mówi „przetestowałem, działa”, a są trzy błędy z poprzednich poziomów: zmienna ze śmieciami, pętla o jeden za daleko i dzielenie bez przecinka.",
           "Poprawiaj po jednym i uruchamiaj po każdej poprawce. Powodzenia, inżynierze!"],
   example="// 1. uruchom  2. przeczytaj błąd  3. popraw jedną rzecz  4. wróć do 1.", exampleOutput="(aż wynik się zgodzi)",
   instructions="Średnia z 5 czujników z jednym miejscem po kropce. Znajdź i popraw 3 błędy AI. Wynik: Srednia temperatura: 22.4",
   starterCode=prog(B50 + AI + "    // Prośba: \"średnia temperatura z 5 czujników\"\n    // Odpowiedź AI: \"Przetestowałem, działa!\"\n    int suma;\n    for (int i = 0; i <= 5; i++) {\n        suma += pomiary[i];\n    }\n    double srednia = suma / 5;\n    printf(\"Srednia temperatura: %.1f\\n\", srednia);\n"),
   solution=prog(B50 + AI + "    // Prośba: \"średnia temperatura z 5 czujników\"\n    // Odpowiedź AI: \"Przetestowałem, działa!\"\n    int suma = 0;\n    for (int i = 0; i < 5; i++) {\n        suma += pomiary[i];\n    }\n    double srednia = (double)suma / 5;\n    printf(\"Srednia temperatura: %.1f\\n\", srednia);\n"),
   solutionWhere="Popraw trzy linijki:", solutionSnippet="int suma = 0;\nfor (int i = 0; i < 5; i++) {\ndouble srednia = (double)suma / 5;",
   expectedOutput="Srednia temperatura: 22.4",
   hints=["Błąd 1: suma nie ma wartości startowej — int suma = 0;", "Błąd 2: pętla sięga o jeden za daleko — i < 5.", "Błąd 3: dzielenie liczb całkowitych ucina ułamek — (double)suma / 5."])


def ts():
    out = ["import type { Level } from '../types'", "",
           "// Levels 21-50 (added 2026-10-08): \"C w pracy\" — devices and electronics",
           "// (21-30) and \"Sprawdź kod od AI\" (31-50). Generated by",
           "// scripts/generate_work_levels.py — edit the script, not this file.",
           "export const workLevels: Level[] = ["]
    for k in L:
        out.append("  {")
        out.append(f"    id: {k['id']},")
        out.append("    kind: 'output',")
        if k.get("ai"):
            out.append("    ai: true,")
        for key in ("title", "concept"):
            out.append(f"    {key}: {json.dumps(k[key], ensure_ascii=False)},")
        out.append(f"    lesson: {json.dumps({'paragraphs': k['lesson'], 'example': k['example'], 'exampleOutput': k['exampleOutput']}, ensure_ascii=False)},")
        for key in ("solutionWhere", "solutionSnippet", "instructions", "starterCode"):
            out.append(f"    {key}: {json.dumps(k[key], ensure_ascii=False)},")
        out.append(f"    hints: {json.dumps(k['hints'], ensure_ascii=False)},")
        out.append(f"    solution: {json.dumps(k['solution'], ensure_ascii=False)},")
        out.append(f"    expectedOutput: {json.dumps(k['expectedOutput'], ensure_ascii=False)},")
        if "mustMatch" in k:
            pat, msg = k["mustMatch"]
            out.append(f"    mustMatch: {{ pattern: new RegExp({json.dumps(pat)}), message: {json.dumps(msg, ensure_ascii=False)} }},")
        out.append("  },")
    out.append("]")
    return "\n".join(out) + "\n"


with open(os.path.join(ROOT, "src/levels/workLevels.ts"), "w") as f:
    f.write(ts())
print(len(L), "levels;", sum(1 for k in L if k.get("ai")), "AI")
