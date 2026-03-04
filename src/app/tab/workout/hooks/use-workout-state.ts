import { useEffect, useMemo, useState } from 'react';
import { addDays, startOfWeek, toDateKey, weekdayLabels } from '../lib/date';
import {
  cloneTemplateToSessionSections,
  createDefaultSetPlans,
  createId,
  loadStore,
  STORAGE_KEY,
} from '../lib/store';
import type {
  DraftExercise,
  ExerciseMetricType,
  SessionSet,
  WorkoutEditorMode,
  WorkoutSession,
  WorkoutStore,
  WorkoutTemplate,
} from '../types';

export const useWorkoutState = () => {
  const [store, setStore] = useState<WorkoutStore>(() => loadStore());
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    toDateKey(new Date()),
  );
  const [weekAnchor, setWeekAnchor] = useState<Date>(() =>
    startOfWeek(new Date()),
  );
  const [mode, setMode] = useState<WorkoutEditorMode>('none');

  const [draftName, setDraftName] = useState('');
  const [draftNotes, setDraftNotes] = useState('');
  const [draftExerciseName, setDraftExerciseName] = useState('');
  const [draftMetricType, setDraftMetricType] =
    useState<ExerciseMetricType>('load_reps');
  const [draftExercises, setDraftExercises] = useState<DraftExercise[]>([]);

  const [restTimerSec, setRestTimerSec] = useState(0);
  const [restTimerRunning, setRestTimerRunning] = useState(false);
  const [assistantVisible, setAssistantVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    if (!restTimerRunning || restTimerSec <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setRestTimerSec((previous) => {
        if (previous <= 1) {
          setRestTimerRunning(false);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [restTimerRunning, restTimerSec]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekAnchor, index)),
    [weekAnchor],
  );

  const selectedPlan =
    store.dayPlans.find((dayPlan) => dayPlan.date === selectedDate) ?? null;
  const selectedTemplate =
    store.templates.find(
      (template) => template.id === selectedPlan?.templateId,
    ) ?? null;

  const selectedSession =
    store.sessions.find((session) => session.date === selectedDate) ?? null;

  const setTemplateForDay = (dateKey: string, templateId: string) => {
    setStore((previous) => {
      const withoutDay = previous.dayPlans.filter(
        (day) => day.date !== dateKey,
      );
      return {
        ...previous,
        dayPlans: [...withoutDay, { date: dateKey, templateId }],
      };
    });
  };

  const startRestTimer = (seconds: number) => {
    setRestTimerSec(seconds);
    setRestTimerRunning(true);
  };

  const toggleRestTimer = () => {
    setRestTimerRunning((previous) => !previous);
  };

  const resetRestTimer = () => {
    setRestTimerRunning(false);
    setRestTimerSec(0);
  };

  const addDraftExercise = () => {
    if (!draftExerciseName.trim()) {
      return;
    }

    setDraftExercises((previous) => [
      ...previous,
      {
        id: createId(),
        name: draftExerciseName.trim(),
        metricType: draftMetricType,
      },
    ]);
    setDraftExerciseName('');
  };

  const createTemplateFromDraft = () => {
    if (!draftName.trim() || draftExercises.length === 0) {
      return;
    }

    const template: WorkoutTemplate = {
      id: createId(),
      name: draftName.trim(),
      notes: draftNotes.trim(),
      sourceType: 'manual',
      version: 1,
      tags: [],
      equipmentNeeded: [],
      isUnilateral: false,
      sections: [
        {
          id: createId(),
          name: 'Main',
          notes: '',
          order: 1,
          exercises: draftExercises.map((exercise) => ({
            id: createId(),
            name: exercise.name,
            notes: '',
            metricType: exercise.metricType,
            restPolicySec: exercise.metricType === 'time' ? 60 : 120,
            setPlans: createDefaultSetPlans(exercise.metricType),
          })),
        },
      ],
    };

    setStore((previous) => ({
      ...previous,
      templates: [template, ...previous.templates],
      dayPlans: [
        ...previous.dayPlans.filter((dayPlan) => dayPlan.date !== selectedDate),
        { date: selectedDate, templateId: template.id },
      ],
    }));

    setDraftName('');
    setDraftNotes('');
    setDraftExercises([]);
    setMode('none');
  };

  const copyFromTemplate = (template: WorkoutTemplate) => {
    const copiedTemplate: WorkoutTemplate = {
      ...template,
      id: createId(),
      name: `${template.name} (copia)`,
      sourceType: 'copied_template',
      version: 1,
      sections: template.sections.map((section) => ({
        ...section,
        id: createId(),
        exercises: section.exercises.map((exercise) => ({
          ...exercise,
          id: createId(),
          setPlans: exercise.setPlans.map((setPlan) => ({
            ...setPlan,
            id: createId(),
          })),
        })),
      })),
    };

    setStore((previous) => ({
      ...previous,
      templates: [copiedTemplate, ...previous.templates],
      dayPlans: [
        ...previous.dayPlans.filter((dayPlan) => dayPlan.date !== selectedDate),
        { date: selectedDate, templateId: copiedTemplate.id },
      ],
    }));
    setMode('none');
  };

  const copyFromSession = (session: WorkoutSession) => {
    const copiedTemplate: WorkoutTemplate = {
      id: createId(),
      name: `${session.nameSnapshot} (da storico)`,
      notes: session.notes,
      sourceType: 'copied_session',
      version: 1,
      tags: [],
      equipmentNeeded: [],
      isUnilateral: false,
      sections: session.sectionsSnapshot.map((section) => ({
        id: createId(),
        name: section.name,
        notes: section.notes,
        order: section.order,
        exercises: section.exercises.map((exercise) => ({
          id: createId(),
          name: exercise.name,
          notes: exercise.notes,
          metricType: exercise.metricType,
          restPolicySec: exercise.restPolicySec,
          setPlans: exercise.sets.map((set) => ({
            id: createId(),
            order: set.order,
            targetKg: set.actualKg,
            targetReps: set.actualReps,
            targetDurationSec: set.actualDurationSec,
            rpeTarget: set.actualRpe,
            notes: set.notes,
          })),
        })),
      })),
    };

    setStore((previous) => ({
      ...previous,
      templates: [copiedTemplate, ...previous.templates],
      dayPlans: [
        ...previous.dayPlans.filter((dayPlan) => dayPlan.date !== selectedDate),
        { date: selectedDate, templateId: copiedTemplate.id },
      ],
    }));
    setMode('none');
  };

  const startSession = () => {
    if (!selectedTemplate || selectedSession?.status === 'in_progress') {
      return;
    }

    const session: WorkoutSession = {
      id: createId(),
      date: selectedDate,
      status: 'in_progress',
      sourceType: selectedTemplate.sourceType,
      templateId: selectedTemplate.id,
      templateVersion: selectedTemplate.version,
      nameSnapshot: selectedTemplate.name,
      notes: selectedTemplate.notes,
      sectionsSnapshot: cloneTemplateToSessionSections(selectedTemplate),
      startedAt: new Date().toISOString(),
    };

    setStore((previous) => ({
      ...previous,
      sessions: [
        ...previous.sessions.filter(
          (existing) => existing.date !== selectedDate,
        ),
        session,
      ],
    }));
    setAssistantVisible(true);
  };

  const updateSessionSet = (
    sectionId: string,
    exerciseId: string,
    setId: string,
    patch: Partial<SessionSet>,
  ) => {
    if (!selectedSession) {
      return;
    }

    setStore((previous) => ({
      ...previous,
      sessions: previous.sessions.map((session) => {
        if (session.id !== selectedSession.id) {
          return session;
        }

        return {
          ...session,
          sectionsSnapshot: session.sectionsSnapshot.map((section) => {
            if (section.id !== sectionId) {
              return section;
            }

            return {
              ...section,
              exercises: section.exercises.map((exercise) => {
                if (exercise.id !== exerciseId) {
                  return exercise;
                }

                return {
                  ...exercise,
                  sets: exercise.sets.map((set) =>
                    set.id === setId ? { ...set, ...patch } : set,
                  ),
                };
              }),
            };
          }),
        };
      }),
    }));
  };

  const toggleSetDone = (
    sectionId: string,
    exerciseId: string,
    setId: string,
    completed: boolean,
  ) => {
    updateSessionSet(sectionId, exerciseId, setId, {
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    });
  };

  const completeSession = () => {
    if (!selectedSession || selectedSession.status !== 'in_progress') {
      return;
    }

    const completedAt = new Date().toISOString();
    const startedTimestamp = selectedSession.startedAt
      ? new Date(selectedSession.startedAt).getTime()
      : null;
    const completedTimestamp = new Date(completedAt).getTime();
    const durationSec =
      startedTimestamp && !Number.isNaN(startedTimestamp)
        ? Math.max(
            0,
            Math.floor((completedTimestamp - startedTimestamp) / 1000),
          )
        : 0;

    setStore((previous) => ({
      ...previous,
      sessions: previous.sessions.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              status: 'completed',
              completedAt,
              durationSec,
            }
          : session,
      ),
    }));
    setAssistantVisible(false);
  };

  const deleteCompletedSession = (sessionId: string) => {
    setStore((previous) => ({
      ...previous,
      sessions: previous.sessions.filter(
        (session) =>
          !(session.id === sessionId && session.status === 'completed'),
      ),
    }));
  };

  const restoreDeletedSession = (sessionToRestore: WorkoutSession) => {
    setStore((previous) => {
      const alreadyExists = previous.sessions.some(
        (session) => session.id === sessionToRestore.id,
      );

      if (alreadyExists) {
        return previous;
      }

      return {
        ...previous,
        sessions: [...previous.sessions, sessionToRestore],
      };
    });
  };

  useEffect(() => {
    if (selectedSession?.status === 'in_progress') {
      setAssistantVisible(true);
      return;
    }

    setAssistantVisible(false);
  }, [selectedSession?.id, selectedSession?.status]);

  const saveSessionAsTemplate = () => {
    if (!selectedSession) {
      return;
    }

    const template: WorkoutTemplate = {
      id: createId(),
      name: `${selectedSession.nameSnapshot} (template)`,
      notes: selectedSession.notes,
      sourceType: 'manual',
      version: 1,
      tags: [],
      equipmentNeeded: [],
      isUnilateral: false,
      sections: selectedSession.sectionsSnapshot.map((section) => ({
        id: createId(),
        name: section.name,
        notes: section.notes,
        order: section.order,
        exercises: section.exercises.map((exercise) => ({
          id: createId(),
          name: exercise.name,
          notes: exercise.notes,
          metricType: exercise.metricType,
          restPolicySec: exercise.restPolicySec,
          setPlans: exercise.sets.map((set) => ({
            id: createId(),
            order: set.order,
            targetKg: set.actualKg,
            targetReps: set.actualReps,
            targetDurationSec: set.actualDurationSec,
            rpeTarget: set.actualRpe,
            notes: set.notes,
          })),
        })),
      })),
    };

    setStore((previous) => ({
      ...previous,
      templates: [template, ...previous.templates],
    }));
  };

  const historySessions = useMemo(
    () =>
      [...store.sessions]
        .filter((session) => session.status === 'completed')
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 4),
    [store.sessions],
  );

  const prRows = useMemo(() => {
    const map = new Map<string, { label: string; value: string }>();

    for (const session of store.sessions.filter(
      (item) => item.status === 'completed',
    )) {
      for (const section of session.sectionsSnapshot) {
        for (const exercise of section.exercises) {
          if (exercise.metricType === 'load_reps') {
            const topSet = exercise.sets.reduce<SessionSet | null>(
              (best, current) => {
                const score =
                  (current.actualKg ?? 0) * (current.actualReps ?? 0);
                const bestScore =
                  (best?.actualKg ?? 0) * (best?.actualReps ?? 0);
                return score > bestScore ? current : best;
              },
              null,
            );

            if (topSet) {
              const label = `${exercise.name} volume`;
              const value = `${topSet.actualKg ?? 0}kg x ${topSet.actualReps ?? 0}`;
              map.set(label, { label, value });
            }
          } else {
            const topDuration = exercise.sets.reduce(
              (best, current) => Math.max(best, current.actualDurationSec ?? 0),
              0,
            );

            if (topDuration > 0) {
              const label = `${exercise.name} hold`;
              map.set(label, { label, value: `${topDuration}s` });
            }
          }
        }
      }
    }

    return Array.from(map.values()).slice(0, 4);
  }, [store.sessions]);

  const isToday = selectedDate === toDateKey(new Date());

  const currentDayStatus = (() => {
    if (selectedSession?.status === 'completed') {
      return 'Completato';
    }
    if (selectedSession?.status === 'in_progress') {
      return 'In corso';
    }
    if (selectedTemplate) {
      return 'Programmato';
    }
    return 'Vuoto';
  })();

  const moveWeek = (days: number) => {
    setWeekAnchor((previous) => addDays(previous, days));
  };

  return {
    store,
    selectedDate,
    setSelectedDate,
    weekDays,
    moveWeek,
    weekdayLabels,
    mode,
    setMode,
    selectedTemplate,
    selectedSession,
    historySessions,
    prRows,
    isToday,
    currentDayStatus,
    draftName,
    setDraftName,
    draftNotes,
    setDraftNotes,
    draftExerciseName,
    setDraftExerciseName,
    draftMetricType,
    setDraftMetricType,
    draftExercises,
    addDraftExercise,
    createTemplateFromDraft,
    copyFromTemplate,
    copyFromSession,
    startSession,
    updateSessionSet,
    toggleSetDone,
    completeSession,
    deleteCompletedSession,
    restoreDeletedSession,
    saveSessionAsTemplate,
    restTimerSec,
    restTimerRunning,
    startRestTimer,
    toggleRestTimer,
    resetRestTimer,
    setTemplateForDay,
    assistantVisible,
    setAssistantVisible,
  };
};

export type WorkoutState = ReturnType<typeof useWorkoutState>;
