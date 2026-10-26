/*
 * Laufzeit-Hilfen von Zeiger. Werden zu jedem Programm dazugelinkt und sind für
 * Lernende unsichtbar.
 *
 * - stdout ohne Puffer: Eine Eingabeaufforderung ohne \n erscheint sofort, und
 *   bei einem Absturz geht keine Ausgabe verloren.
 * - Speicherprüfung über -Wl,--wrap: malloc, calloc, realloc und free werden
 *   mitgezählt. Am Programmende meldet die Prüfung nicht freigegebene Blöcke,
 *   ein falsches free bricht sofort ab.
 * - fopen/fclose sind ebenfalls umhüllt, damit eine nie geschlossene Datei als
 *   solche erkennbar ist und nicht als rätselhaftes Speicherleck erscheint.
 * - Reservierungen der C-Bibliothek selbst (argv vor main, Pfadpuffer in fopen)
 *   gelten als intern und werden nie gemeldet.
 *
 * Meldungen gehen als Zeilen mit dem Präfix \001ZEIGER: auf stderr. Der Runner
 * filtert sie heraus und übersetzt sie.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void *__real_malloc(size_t n);
void *__real_calloc(size_t n, size_t size);
void *__real_realloc(void *p, size_t n);
void __real_free(void *p);
FILE *__real_fopen(const char *restrict name, const char *restrict mode);
int __real_fclose(FILE *f);
int __real___main_argc_argv(int argc, char **argv) __attribute__((weak));

#define ZEIGER_MAX_BLOECKE 8192
#define ZEIGER_MAX_FREI 256
#define ZEIGER_MAX_DATEIEN 32

typedef struct {
    void *adresse;
    size_t groesse;
    /* Laufende Nummer der Reservierung durch das Programm; 0 = intern. */
    unsigned nummer;
    /* Index+1 in zeiger_dateien, wenn der Block ein FILE ist. */
    unsigned char datei;
} zeiger_block;

static zeiger_block zeiger_bloecke[ZEIGER_MAX_BLOECKE];
static unsigned zeiger_anzahl = 0;
static unsigned zeiger_nummer = 0;
static int zeiger_unvollstaendig = 0;
static int zeiger_intern = 1;
static void *zeiger_frei[ZEIGER_MAX_FREI];
static unsigned zeiger_frei_pos = 0;
static char zeiger_dateien[ZEIGER_MAX_DATEIEN][48];
static unsigned zeiger_dateien_anzahl = 0;

static void zeiger_melden(const char *text) {
    fputs("\001ZEIGER:", stderr);
    fputs(text, stderr);
    fputc('\n', stderr);
}

static void zeiger_merken(void *p, size_t n) {
    if (p == NULL) {
        return;
    }
    for (unsigned i = 0; i < ZEIGER_MAX_FREI; i++) {
        if (zeiger_frei[i] == p) {
            zeiger_frei[i] = NULL;
        }
    }
    if (zeiger_anzahl >= ZEIGER_MAX_BLOECKE) {
        zeiger_unvollstaendig = 1;
        return;
    }
    zeiger_block *b = &zeiger_bloecke[zeiger_anzahl++];
    b->adresse = p;
    b->groesse = n;
    b->nummer = zeiger_intern ? 0 : ++zeiger_nummer;
    b->datei = 0;
}

static int zeiger_suchen(void *p) {
    for (unsigned i = 0; i < zeiger_anzahl; i++) {
        if (zeiger_bloecke[i].adresse == p) {
            return (int)i;
        }
    }
    return -1;
}

static void zeiger_falsches_free(void *p, const char *funktion) {
    char text[64];
    int doppelt = 0;
    for (unsigned i = 0; i < ZEIGER_MAX_FREI; i++) {
        if (zeiger_frei[i] == p) {
            doppelt = 1;
        }
    }
    snprintf(text, sizeof text, "%s %s", doppelt ? "DOPPELT" : "UNGUELTIG", funktion);
    zeiger_melden(text);
    _Exit(134);
}

void *__wrap_malloc(size_t n) {
    void *p = __real_malloc(n);
    zeiger_merken(p, n);
    return p;
}

void *__wrap_calloc(size_t n, size_t size) {
    void *p = __real_calloc(n, size);
    zeiger_merken(p, n * size);
    return p;
}

void *__wrap_realloc(void *p, size_t n) {
    if (p == NULL) {
        return __wrap_malloc(n);
    }
    int i = zeiger_suchen(p);
    if (i < 0 && !zeiger_unvollstaendig) {
        zeiger_falsches_free(p, "realloc");
    }
    void *neu = __real_realloc(p, n);
    if (neu != NULL && i >= 0) {
        zeiger_bloecke[i].adresse = neu;
        zeiger_bloecke[i].groesse = n;
    }
    return neu;
}

void __wrap_free(void *p) {
    if (p == NULL) {
        return;
    }
    int i = zeiger_suchen(p);
    if (i < 0) {
        if (zeiger_unvollstaendig) {
            __real_free(p);
            return;
        }
        zeiger_falsches_free(p, "free");
    }
    zeiger_bloecke[i] = zeiger_bloecke[--zeiger_anzahl];
    zeiger_frei[zeiger_frei_pos] = p;
    zeiger_frei_pos = (zeiger_frei_pos + 1) % ZEIGER_MAX_FREI;
    __real_free(p);
}

FILE *__wrap_fopen(const char *restrict name, const char *restrict mode) {
    int vorher = zeiger_intern;
    zeiger_intern = 1;
    FILE *f = __real_fopen(name, mode);
    zeiger_intern = vorher;
    int i = f != NULL ? zeiger_suchen(f) : -1;
    if (i >= 0 && zeiger_dateien_anzahl < ZEIGER_MAX_DATEIEN && !zeiger_intern) {
        strncpy(zeiger_dateien[zeiger_dateien_anzahl], name, sizeof zeiger_dateien[0] - 1);
        zeiger_bloecke[i].datei = (unsigned char)(++zeiger_dateien_anzahl);
    }
    return f;
}

int __wrap_fclose(FILE *f) {
    if (f == NULL) {
        zeiger_melden("FCLOSE_NULL");
        _Exit(134);
    }
    return __real_fclose(f);
}

/* Nur bei main(int argc, char *argv[]): Ab hier reserviert das Programm selbst. */
int __wrap___main_argc_argv(int argc, char **argv) {
    zeiger_intern = 0;
    return __real___main_argc_argv(argc, argv);
}

__attribute__((constructor)) static void zeiger_start(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    /* main(void) läuft ohne __main_argc_argv; vor main reserviert die
       Bibliothek dann nichts, also darf die Zählung gleich beginnen. */
    if (__real___main_argc_argv == NULL) {
        zeiger_intern = 0;
    }
}

__attribute__((destructor)) static void zeiger_bericht(void) {
    char text[96];
    zeiger_intern = 1;
    for (unsigned i = 0; i < zeiger_anzahl; i++) {
        zeiger_block *b = &zeiger_bloecke[i];
        if (b->datei != 0) {
            snprintf(text, sizeof text, "DATEI_OFFEN %s", zeiger_dateien[b->datei - 1]);
        } else if (b->nummer != 0) {
            snprintf(text, sizeof text, "LECK %u %zu", b->nummer, b->groesse);
        } else {
            continue;
        }
        zeiger_melden(text);
    }
    if (zeiger_unvollstaendig) {
        zeiger_melden("UNVOLLSTAENDIG");
    }
}
