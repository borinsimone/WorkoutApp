import { addDays, toDateKey } from './date';
import type {
  ExerciseMetricType,
  SessionSection,
  WorkoutSession,
  WorkoutStore,
  WorkoutTemplate,
} from '../types';

export const STORAGE_KEY = 'workout-app-v1-store';

export const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

export const createDefaultSetPlans = (metricType: ExerciseMetricType) => {
  if (metricType === 'time') {
    return Array.from({ length: 3 }, (_, index) => ({
      id: createId(),
      order: index + 1,
      targetDurationSec: 30,
      notes: '',
    }));
  }

  return Array.from({ length: 3 }, (_, index) => ({
    id: createId(),
    order: index + 1,
    targetKg: 0,
    targetReps: 10,
    rpeTarget: 7,
    notes: '',
  }));
};

export const cloneTemplateToSessionSections = (
  template: WorkoutTemplate,
): SessionSection[] => {
  return template.sections.map((section) => ({
    id: section.id,
    name: section.name,
    notes: section.notes,
    order: section.order,
    exercises: section.exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      notes: exercise.notes,
      metricType: exercise.metricType,
      restPolicySec: exercise.restPolicySec,
      sets: exercise.setPlans.map((setPlan) => ({
        id: createId(),
        order: setPlan.order,
        completed: false,
        actualKg: setPlan.targetKg,
        actualReps: setPlan.targetReps,
        actualRpe: setPlan.rpeTarget,
        actualDurationSec: setPlan.targetDurationSec,
        notes: setPlan.notes,
      })),
    })),
  }));
};

export const createSeedStore = (): WorkoutStore => {
  const today = new Date();
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);

  const templateA: WorkoutTemplate = {
    id: createId(),
    name: 'Push + Verticale',
    notes: 'Focus su forza spinta e controllo verticale.',
    sourceType: 'library',
    version: 1,
    tags: ['forza', 'skill'],
    equipmentNeeded: ['parallele', 'manubri'],
    isUnilateral: false,
    sections: [
      {
        id: createId(),
        name: 'Riscaldamento',
        notes: 'Attivazione spalle e polsi',
        order: 1,
        exercises: [
          {
            id: createId(),
            name: 'Wall handstand hold',
            notes: 'Core attivo',
            metricType: 'time',
            restPolicySec: 60,
            setPlans: createDefaultSetPlans('time'),
          },
        ],
      },
      {
        id: createId(),
        name: 'Main',
        notes: 'Volume progressivo',
        order: 2,
        exercises: [
          {
            id: createId(),
            name: 'Panca piana',
            notes: 'Controlla eccentrica',
            metricType: 'load_reps',
            restPolicySec: 120,
            setPlans: [
              {
                id: createId(),
                order: 1,
                targetKg: 60,
                targetReps: 8,
                rpeTarget: 7,
              },
              {
                id: createId(),
                order: 2,
                targetKg: 62.5,
                targetReps: 8,
                rpeTarget: 8,
              },
              {
                id: createId(),
                order: 3,
                targetKg: 65,
                targetReps: 6,
                rpeTarget: 8,
              },
            ],
          },
        ],
      },
    ],
  };

  const completedSession: WorkoutSession = {
    id: createId(),
    date: toDateKey(yesterday),
    status: 'completed',
    sourceType: 'library',
    templateId: templateA.id,
    templateVersion: 1,
    nameSnapshot: templateA.name,
    notes: 'Sessione solida',
    sectionsSnapshot: cloneTemplateToSessionSections(templateA).map(
      (section) => ({
        ...section,
        exercises: section.exercises.map((exercise) => ({
          ...exercise,
          sets: exercise.sets.map((set) => ({
            ...set,
            completed: true,
            completedAt: new Date().toISOString(),
            actualKg:
              exercise.metricType === 'load_reps'
                ? (set.actualKg ?? 0) + 2.5
                : undefined,
            actualDurationSec:
              exercise.metricType === 'time'
                ? (set.actualDurationSec ?? 0) + 5
                : undefined,
          })),
        })),
      }),
    ),
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  return {
    templates: [templateA],
    sessions: [completedSession],
    dayPlans: [
      { date: toDateKey(today), templateId: templateA.id },
      { date: toDateKey(tomorrow), templateId: templateA.id },
    ],
  };
};

export const loadStore = (): WorkoutStore => {
  if (typeof window === 'undefined') {
    return createSeedStore();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createSeedStore();
  }

  try {
    return JSON.parse(raw) as WorkoutStore;
  } catch {
    return createSeedStore();
  }
};
