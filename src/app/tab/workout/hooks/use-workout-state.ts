import { useEffect, useMemo, useState } from 'react';
import { addDays, startOfWeek, toDateKey, weekdayLabels } from '../lib/date';
import {
  cloneTemplateToSessionSections,
  createId,
  loadStore,
  STORAGE_KEY,
} from '../lib/store';
import type {
  ExerciseKind,
  WorkoutTemplate as WorkoutModelTemplate,
} from '../workout-model.types';
import type {
  DraftExercise,
  DraftExerciseSet,
  DraftSection,
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
  const [draftSectionName, setDraftSectionName] = useState('Main');
  const [draftTargetSectionId, setDraftTargetSectionId] = useState('');
  const [draftExerciseName, setDraftExerciseName] = useState('');
  const [draftExerciseKind, setDraftExerciseKind] =
    useState<ExerciseKind>('load_reps');
  const createDraftSetRow = (
    kind: ExerciseKind,
    seed?: DraftExerciseSet,
  ): DraftExerciseSet => {
    if (kind === 'time') {
      return {
        id: createId(),
        targetSec: Math.max(1, seed?.targetSec ?? 30),
      };
    }

    return {
      id: createId(),
      loadKg: Math.max(0, seed?.loadKg ?? 0),
      targetReps: Math.max(1, seed?.targetReps ?? 10),
      rpe: Math.max(1, Math.min(10, seed?.rpe ?? 7)),
    };
  };
  const [draftSetRows, setDraftSetRows] = useState<DraftExerciseSet[]>([
    createDraftSetRow('load_reps'),
  ]);
  const [draftSections, setDraftSections] = useState<DraftSection[]>([]);

  const [restTimerSec, setRestTimerSec] = useState(0);
  const [restTimerRunning, setRestTimerRunning] = useState(false);
  const [assistantVisible, setAssistantVisible] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    if (!feedbackToast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedbackToast(null);
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [feedbackToast]);

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

  useEffect(() => {
    setDraftSetRows((previous) => {
      if (previous.length === 0) {
        return [createDraftSetRow(draftExerciseKind)];
      }

      return previous.map((row) => createDraftSetRow(draftExerciseKind, row));
    });
  }, [draftExerciseKind]);

  useEffect(() => {
    setDraftTargetSectionId((current) => {
      if (draftSections.length === 0) {
        return '';
      }

      const hasCurrentSection = draftSections.some(
        (section) => section.id === current,
      );

      if (hasCurrentSection) {
        return current;
      }

      return draftSections[0].id;
    });
  }, [draftSections]);

  const addDraftSection = () => {
    const sectionName = draftSectionName.trim();

    if (!sectionName) {
      return;
    }

    const sectionId = createId();

    setDraftSections((previous) => [
      ...previous,
      {
        id: sectionId,
        name: sectionName,
        exercises: [],
      },
    ]);

    setDraftSectionName('');
    setDraftTargetSectionId(sectionId);
  };

  const removeDraftSection = (sectionId: string) => {
    setDraftSections((previous) =>
      previous.filter((section) => section.id !== sectionId),
    );
  };

  const updateDraftSection = (sectionId: string, name: string) => {
    setDraftSections((previous) =>
      previous.map((section) =>
        section.id === sectionId ? { ...section, name } : section,
      ),
    );
  };

  const moveDraftSection = (
    sourceSectionId: string,
    targetSectionId: string,
  ) => {
    if (sourceSectionId === targetSectionId) {
      return;
    }

    setDraftSections((previous) => {
      const sourceIndex = previous.findIndex(
        (section) => section.id === sourceSectionId,
      );
      const targetIndex = previous.findIndex(
        (section) => section.id === targetSectionId,
      );

      if (sourceIndex < 0 || targetIndex < 0) {
        return previous;
      }

      const next = [...previous];
      const [movingSection] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, movingSection);
      return next;
    });
  };

  const clearDraftSections = () => {
    setDraftSections([]);
  };

  const addDraftSetRow = () => {
    setDraftSetRows((previous) => [
      ...previous,
      createDraftSetRow(draftExerciseKind),
    ]);
  };

  const removeDraftSetRow = (setId: string) => {
    setDraftSetRows((previous) => {
      if (previous.length <= 1) {
        return previous;
      }

      return previous.filter((row) => row.id !== setId);
    });
  };

  const updateDraftSetRow = (
    setId: string,
    patch: Partial<DraftExerciseSet>,
  ) => {
    setDraftSetRows((previous) =>
      previous.map((row) => (row.id === setId ? { ...row, ...patch } : row)),
    );
  };

  const addDraftExercise = () => {
    if (!draftExerciseName.trim() || !draftTargetSectionId) {
      return;
    }

    const normalizedRows = draftSetRows.length
      ? draftSetRows
      : [createDraftSetRow(draftExerciseKind)];

    const draftExercise: DraftExercise = {
      id: createId(),
      name: draftExerciseName.trim(),
      kind: draftExerciseKind,
      sets: normalizedRows.map((row) =>
        draftExerciseKind === 'time'
          ? {
              id: createId(),
              targetSec: Math.max(1, row.targetSec ?? 30),
            }
          : {
              id: createId(),
              loadKg: Math.max(0, row.loadKg ?? 0),
              targetReps: Math.max(1, row.targetReps ?? 10),
              rpe: Math.max(1, Math.min(10, row.rpe ?? 7)),
            },
      ),
    };

    setDraftSections((previous) =>
      previous.map((section) =>
        section.id === draftTargetSectionId
          ? {
              ...section,
              exercises: [...section.exercises, draftExercise],
            }
          : section,
      ),
    );

    setDraftExerciseName('');
    setDraftSetRows([createDraftSetRow(draftExerciseKind)]);
  };

  const removeDraftExercise = (sectionId: string, exerciseId: string) => {
    setDraftSections((previous) =>
      previous.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          exercises: section.exercises.filter(
            (exercise) => exercise.id !== exerciseId,
          ),
        };
      }),
    );
  };

  const updateDraftExercise = (
    sectionId: string,
    exerciseId: string,
    patch: {
      name?: string;
      kind?: ExerciseKind;
    },
  ) => {
    setDraftSections((previous) =>
      previous.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          exercises: section.exercises.map((exercise) => {
            if (exercise.id !== exerciseId) {
              return exercise;
            }

            const nextKind = patch.kind ?? exercise.kind;

            return {
              ...exercise,
              name: patch.name ?? exercise.name,
              kind: nextKind,
              sets:
                nextKind === exercise.kind
                  ? exercise.sets
                  : exercise.sets.map((setRow) =>
                      createDraftSetRow(nextKind, setRow),
                    ),
            };
          }),
        };
      }),
    );
  };

  const moveDraftExercise = (
    sourceSectionId: string,
    targetSectionId: string,
    exerciseId: string,
    targetExerciseId?: string,
  ) => {
    setDraftSections((previous) => {
      const sourceSection = previous.find(
        (section) => section.id === sourceSectionId,
      );
      const targetSection = previous.find(
        (section) => section.id === targetSectionId,
      );

      if (!sourceSection || !targetSection) {
        return previous;
      }

      const sourceExercise = sourceSection.exercises.find(
        (exercise) => exercise.id === exerciseId,
      );

      if (!sourceExercise) {
        return previous;
      }

      if (
        sourceSectionId === targetSectionId &&
        (!targetExerciseId || targetExerciseId === exerciseId)
      ) {
        return previous;
      }

      return previous.map((section) => {
        if (section.id === sourceSectionId && section.id === targetSectionId) {
          const withoutMoving = section.exercises.filter(
            (exercise) => exercise.id !== exerciseId,
          );

          const insertIndex = targetExerciseId
            ? withoutMoving.findIndex(
                (exercise) => exercise.id === targetExerciseId,
              )
            : withoutMoving.length;

          const safeInsertIndex =
            insertIndex < 0 ? withoutMoving.length : insertIndex;
          const nextExercises = [...withoutMoving];
          nextExercises.splice(safeInsertIndex, 0, sourceExercise);

          return {
            ...section,
            exercises: nextExercises,
          };
        }

        if (section.id === sourceSectionId) {
          return {
            ...section,
            exercises: section.exercises.filter(
              (exercise) => exercise.id !== exerciseId,
            ),
          };
        }

        if (section.id === targetSectionId) {
          const insertIndex = targetExerciseId
            ? section.exercises.findIndex(
                (exercise) => exercise.id === targetExerciseId,
              )
            : section.exercises.length;

          const safeInsertIndex =
            insertIndex < 0 ? section.exercises.length : insertIndex;
          const nextExercises = [...section.exercises];
          nextExercises.splice(safeInsertIndex, 0, sourceExercise);

          return {
            ...section,
            exercises: nextExercises,
          };
        }

        return section;
      });
    });
  };

  const addSetToExercise = (sectionId: string, exerciseId: string) => {
    setDraftSections((previous) =>
      previous.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          exercises: section.exercises.map((exercise) => {
            if (exercise.id !== exerciseId) {
              return exercise;
            }

            const lastSet = exercise.sets[exercise.sets.length - 1];

            return {
              ...exercise,
              sets: [
                ...exercise.sets,
                createDraftSetRow(exercise.kind, lastSet),
              ],
            };
          }),
        };
      }),
    );
  };

  const updateExerciseSet = (
    sectionId: string,
    exerciseId: string,
    setId: string,
    patch: Partial<DraftExerciseSet>,
  ) => {
    setDraftSections((previous) =>
      previous.map((section) => {
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
              sets: exercise.sets.map((setRow) =>
                setRow.id === setId ? { ...setRow, ...patch } : setRow,
              ),
            };
          }),
        };
      }),
    );
  };

  const removeExerciseSet = (
    sectionId: string,
    exerciseId: string,
    setId: string,
  ) => {
    setDraftSections((previous) =>
      previous.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          exercises: section.exercises.map((exercise) => {
            if (exercise.id !== exerciseId || exercise.sets.length <= 1) {
              return exercise;
            }

            return {
              ...exercise,
              sets: exercise.sets.filter((setRow) => setRow.id !== setId),
            };
          }),
        };
      }),
    );
  };

  const createDraftSets = (exercise: DraftExercise) => {
    if (exercise.kind === 'time') {
      return exercise.sets.map((row) => ({
        id: createId(),
        kind: 'time' as const,
        targetSec: Math.max(1, row.targetSec ?? 30),
        done: false,
      }));
    }

    return exercise.sets.map((row) => ({
      id: createId(),
      kind: 'load_reps' as const,
      targetReps: Math.max(1, row.targetReps ?? 10),
      loadKg: Math.max(0, row.loadKg ?? 0),
      rpe: Math.max(1, Math.min(10, row.rpe ?? 7)),
      done: false,
    }));
  };

  const buildDraftModelTemplate = (): WorkoutModelTemplate | null => {
    const nonEmptySections = draftSections
      .map((section) => ({
        ...section,
        exercises: section.exercises.filter(
          (exercise) => exercise.name.trim().length > 0,
        ),
      }))
      .filter((section) => section.exercises.length > 0);

    if (!draftName.trim() || nonEmptySections.length === 0) {
      return null;
    }

    return {
      id: createId(),
      name: draftName.trim(),
      notes: draftNotes.trim() || undefined,
      sections: nonEmptySections.map((section) => ({
        id: createId(),
        name: section.name.trim() || 'Main',
        exercises: section.exercises.map((exercise) => ({
          id: createId(),
          name: exercise.name,
          kind: exercise.kind,
          sets: createDraftSets(exercise),
        })),
      })),
      createdAt: new Date().toISOString(),
      source: 'user',
    };
  };

  const mapModelTemplateToStoreTemplate = (
    modelTemplate: WorkoutModelTemplate,
    options?: {
      tags?: string[];
      equipmentNeeded?: string[];
      isUnilateral?: boolean;
    },
  ): WorkoutTemplate => {
    return {
      id: modelTemplate.id,
      name: modelTemplate.name,
      notes: modelTemplate.notes,
      sourceType: 'manual',
      version: 1,
      tags: options?.tags ?? [],
      equipmentNeeded: options?.equipmentNeeded ?? [],
      isUnilateral: options?.isUnilateral ?? false,
      sections: modelTemplate.sections.map((section, sectionIndex) => ({
        id: section.id,
        name: section.name,
        notes: '',
        order: sectionIndex + 1,
        exercises: section.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          notes: '',
          metricType: exercise.kind,
          restPolicySec: exercise.kind === 'time' ? 60 : 120,
          setPlans: exercise.sets.map((set, setIndex) => ({
            id: createId(),
            order: setIndex + 1,
            targetKg:
              set.kind === 'load_reps' ? (set.loadKg ?? undefined) : undefined,
            targetReps:
              set.kind === 'load_reps'
                ? (set.targetReps ?? undefined)
                : undefined,
            targetDurationSec: set.kind === 'time' ? set.targetSec : undefined,
            rpeTarget:
              set.kind === 'load_reps' ? (set.rpe ?? undefined) : undefined,
            notes: '',
          })),
        })),
      })),
    };
  };

  const editPlannedWorkout = () => {
    if (!selectedTemplate || selectedSession) {
      return;
    }

    const draftSectionsFromTemplate: DraftSection[] =
      selectedTemplate.sections.map((section) => ({
        id: createId(),
        name: section.name,
        exercises: section.exercises.map((exercise) => {
          const firstSet = exercise.setPlans[0];

          return {
            id: createId(),
            name: exercise.name,
            kind: exercise.metricType,
            sets: exercise.setPlans.length
              ? exercise.setPlans.map((setPlan) => ({
                  id: createId(),
                  targetReps: setPlan.targetReps,
                  loadKg: setPlan.targetKg,
                  rpe: setPlan.rpeTarget,
                  targetSec: setPlan.targetDurationSec,
                }))
              : [
                  {
                    id: createId(),
                    targetReps: firstSet?.targetReps,
                    loadKg: firstSet?.targetKg,
                    rpe: firstSet?.rpeTarget,
                    targetSec: firstSet?.targetDurationSec,
                  },
                ],
          };
        }),
      }));

    const firstDraftSection = draftSectionsFromTemplate[0];
    const firstDraftExercise = firstDraftSection?.exercises[0];

    setDraftName(selectedTemplate.name);
    setDraftNotes(selectedTemplate.notes ?? '');
    setDraftSectionName(firstDraftSection?.name ?? 'Main');
    setDraftTargetSectionId(firstDraftSection?.id ?? '');
    setDraftExerciseName('');
    setDraftExerciseKind(firstDraftExercise?.kind ?? 'load_reps');
    setDraftSetRows(
      firstDraftExercise?.sets?.length
        ? firstDraftExercise.sets.map((row) => ({ ...row, id: createId() }))
        : [createDraftSetRow(firstDraftExercise?.kind ?? 'load_reps')],
    );
    setDraftSections(draftSectionsFromTemplate);
    setMode('edit');
  };

  const createTemplateFromDraft = () => {
    const modelTemplate = buildDraftModelTemplate();
    if (!modelTemplate) {
      return;
    }

    const template = mapModelTemplateToStoreTemplate(modelTemplate);

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
    setDraftSectionName('Main');
    setDraftTargetSectionId('');
    setDraftExerciseName('');
    setDraftSetRows([createDraftSetRow('load_reps')]);
    setDraftSections([]);
    setMode('none');
    setFeedbackToast('Allenamento programmato modificato');
  };

  const saveEditedPlannedWorkout = () => {
    if (!selectedTemplate) {
      return;
    }

    const modelTemplate = buildDraftModelTemplate();
    if (!modelTemplate) {
      return;
    }

    const updatedTemplate = mapModelTemplateToStoreTemplate(modelTemplate, {
      tags: [...selectedTemplate.tags],
      equipmentNeeded: [...selectedTemplate.equipmentNeeded],
      isUnilateral: selectedTemplate.isUnilateral,
    });

    setStore((previous) => ({
      ...previous,
      templates: [updatedTemplate, ...previous.templates],
      dayPlans: [
        ...previous.dayPlans.filter((dayPlan) => dayPlan.date !== selectedDate),
        { date: selectedDate, templateId: updatedTemplate.id },
      ],
    }));

    setDraftName('');
    setDraftNotes('');
    setDraftSectionName('Main');
    setDraftTargetSectionId('');
    setDraftExerciseName('');
    setDraftSetRows([createDraftSetRow('load_reps')]);
    setDraftSections([]);
    setMode('none');
  };

  const deletePlannedWorkout = () => {
    if (selectedSession?.status === 'in_progress') {
      return;
    }

    setStore((previous) => ({
      ...previous,
      dayPlans: previous.dayPlans.filter(
        (dayPlan) => dayPlan.date !== selectedDate,
      ),
    }));
    setFeedbackToast('Allenamento programmato eliminato');
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
    draftSectionName,
    setDraftSectionName,
    draftTargetSectionId,
    setDraftTargetSectionId,
    draftSections,
    addDraftSection,
    updateDraftSection,
    moveDraftSection,
    removeDraftSection,
    clearDraftSections,
    draftExerciseName,
    setDraftExerciseName,
    draftExerciseKind,
    setDraftExerciseKind,
    draftSetRows,
    addDraftSetRow,
    removeDraftSetRow,
    updateDraftSetRow,
    addDraftExercise,
    updateDraftExercise,
    moveDraftExercise,
    removeDraftExercise,
    addSetToExercise,
    updateExerciseSet,
    removeExerciseSet,
    editPlannedWorkout,
    createTemplateFromDraft,
    saveEditedPlannedWorkout,
    copyFromTemplate,
    copyFromSession,
    startSession,
    updateSessionSet,
    toggleSetDone,
    completeSession,
    deleteCompletedSession,
    deletePlannedWorkout,
    restoreDeletedSession,
    saveSessionAsTemplate,
    restTimerSec,
    restTimerRunning,
    startRestTimer,
    toggleRestTimer,
    resetRestTimer,
    assistantVisible,
    setAssistantVisible,
    feedbackToast,
  };
};

export type WorkoutState = ReturnType<typeof useWorkoutState>;
