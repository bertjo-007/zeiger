import { createEmptyCard, fsrs, generatorParameters, Rating, type Card as FCard, type FSRS, type Grade } from 'ts-fsrs';

/**
 * Dünne Schicht über ts-fsrs (Muster aus Grapnel). Gespeichert wird mit Zahlen
 * (ms), ts-fsrs rechnet mit Date-Objekten.
 *
 * Die Bewertung ergibt sich aus der Antwort, Joshua muss sich nicht selbst
 * einschätzen: falsch → Again, richtig mit Hinweis → Hard, richtig → Good.
 * So kommen schwierige Fragen bald wieder, beherrschte nur noch gelegentlich.
 */

export interface FsrsData {
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: 0 | 1 | 2 | 3;
  last_review: number | null;
}

let cached: FSRS | null = null;

function scheduler(): FSRS {
  cached ??= fsrs(generatorParameters({ request_retention: 0.9, maximum_interval: 180, enable_fuzz: true, enable_short_term: true }));
  return cached;
}

export function emptyFsrs(now: number): FsrsData {
  return fromF(createEmptyCard(new Date(now)));
}

function toF(d: FsrsData): FCard {
  return {
    due: new Date(d.due),
    stability: d.stability,
    difficulty: d.difficulty,
    elapsed_days: d.elapsed_days,
    scheduled_days: d.scheduled_days,
    learning_steps: d.learning_steps,
    reps: d.reps,
    lapses: d.lapses,
    state: d.state,
    last_review: d.last_review === null ? undefined : new Date(d.last_review),
  } as FCard;
}

function fromF(c: FCard): FsrsData {
  return {
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps ?? 0,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state as FsrsData['state'],
    last_review: c.last_review ? new Date(c.last_review).getTime() : null,
  };
}

export function gradeFor(richtig: boolean, hinweise: number): Grade {
  if (!richtig) return Rating.Again;
  return hinweise > 0 ? Rating.Hard : Rating.Good;
}

export function applyGrade(data: FsrsData | null, grade: Grade, at: number): FsrsData {
  const base = data ?? emptyFsrs(at);
  const when = base.last_review !== null && at < base.last_review ? base.last_review : at;
  return fromF(scheduler().next(toF(base), new Date(when), grade).card);
}
