import { useEffect } from 'react';
import type { WorkoutState } from '../hooks/use-workout-state';
import type { ExerciseMetricType } from '../types';
import styles from '../styles/page.module.scss';

type CreateWorkoutCardProps = Pick<
  WorkoutState,
  | 'mode'
  | 'draftName'
  | 'setDraftName'
  | 'draftNotes'
  | 'setDraftNotes'
  | 'draftExerciseName'
  | 'setDraftExerciseName'
  | 'draftMetricType'
  | 'setDraftMetricType'
  | 'draftExercises'
  | 'addDraftExercise'
  | 'createTemplateFromDraft'
  | 'setMode'
>;

export function CreateWorkoutCard({
  mode,
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
  setMode,
}: CreateWorkoutCardProps) {
  useEffect(() => {
    if (mode !== 'create') {
      return;
    }

    document.body.classList.add('workout-modal-open');

    return () => {
      document.body.classList.remove('workout-modal-open');
    };
  }, [mode]);

  if (mode !== 'create') {
    return null;
  }

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => setMode('none')}
    >
      <div
        className={styles.modalSheet}
        role='dialog'
        aria-modal='true'
        aria-label='Crea allenamento'
        onClick={(event) => event.stopPropagation()}
      >
        <article className={styles.editorCard}>
          <div className={styles.modalHeader}>
            <h3 className={styles.cardTitle}>Crea allenamento da zero</h3>
            <button
              type='button'
              className={styles.secondaryButton}
              onClick={() => setMode('none')}
            >
              Chiudi
            </button>
          </div>

          <input
            className={styles.textInput}
            placeholder='Nome allenamento'
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
          />
          <textarea
            className={styles.textArea}
            placeholder='Note allenamento'
            value={draftNotes}
            onChange={(event) => setDraftNotes(event.target.value)}
          />

          <div className={styles.inlineEditor}>
            <input
              className={styles.textInput}
              placeholder='Nome esercizio'
              value={draftExerciseName}
              onChange={(event) => setDraftExerciseName(event.target.value)}
            />
            <select
              className={styles.selectInput}
              value={draftMetricType}
              onChange={(event) =>
                setDraftMetricType(event.target.value as ExerciseMetricType)
              }
            >
              <option value='load_reps'>Reps + Kg</option>
              <option value='time'>Tempo</option>
            </select>
            <button
              type='button'
              className={styles.pillButton}
              onClick={addDraftExercise}
            >
              Aggiungi
            </button>
          </div>

          <div className={styles.badgeList}>
            {draftExercises.map((exercise) => (
              <span
                key={exercise.id}
                className={styles.badge}
              >
                {exercise.name} ·{' '}
                {exercise.metricType === 'time' ? 'Tempo' : 'Kg/Reps'}
              </span>
            ))}
          </div>

          <div className={styles.primaryActions}>
            <button
              type='button'
              className={styles.primaryButton}
              onClick={createTemplateFromDraft}
            >
              Salva e assegna al giorno
            </button>
            <button
              type='button'
              className={styles.secondaryButton}
              onClick={() => setMode('none')}
            >
              Annulla
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
