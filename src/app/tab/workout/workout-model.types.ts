export type SessionStatus = 'planned' | 'in_progress' | 'completed';
export type ExerciseKind = 'load_reps' | 'time';

export interface WorkoutStore {
  templatesByDate: Record<string, WorkoutTemplate>; // key: YYYY-MM-DD
  sessions: WorkoutSession[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  notes?: string;
  sections: WorkoutSection[];
  createdAt: string; // ISO
  source?: 'seed' | 'user' | 'copy';
}

export interface WorkoutSection {
  id: string;
  name: string; // es: "Riscaldamento", "Main"
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  name: string;
  kind: ExerciseKind;
  sets: WorkoutSet[];
}

export type WorkoutSet = LoadRepsSet | TimeSet;

export interface LoadRepsSet {
  id: string;
  kind: 'load_reps';
  targetReps?: number;
  loadKg?: number | null;
  reps?: number | null;
  rpe?: number | null;
  done: boolean;
}

export interface TimeSet {
  id: string;
  kind: 'time';
  targetSec: number;
  actualSec?: number | null;
  done: boolean;
}

export interface WorkoutSession {
  id: string;
  dateKey: string; // YYYY-MM-DD
  templateId?: string;
  name: string;
  status: SessionStatus;

  startedAt?: string; // ISO
  completedAt?: string; // ISO
  durationSec?: number; // salvata a completamento (grafici)

  sections: WorkoutSection[]; // snapshot eseguito
  notes?: string;
}
