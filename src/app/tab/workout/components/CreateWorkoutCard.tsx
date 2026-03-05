import { useEffect, useState } from 'react';
import type { WorkoutState } from '../hooks/use-workout-state';
import type { ExerciseKind } from '../workout-model.types';
import styles from '../styles/page.module.scss';

type CreateWorkoutCardProps = Pick<
  WorkoutState,
  | 'mode'
  | 'draftName'
  | 'setDraftName'
  | 'draftNotes'
  | 'setDraftNotes'
  | 'draftSectionName'
  | 'setDraftSectionName'
  | 'draftTargetSectionId'
  | 'setDraftTargetSectionId'
  | 'draftSections'
  | 'addDraftSection'
  | 'updateDraftSection'
  | 'moveDraftSection'
  | 'removeDraftSection'
  | 'clearDraftSections'
  | 'draftExerciseName'
  | 'setDraftExerciseName'
  | 'draftExerciseKind'
  | 'setDraftExerciseKind'
  | 'draftSetRows'
  | 'addDraftSetRow'
  | 'removeDraftSetRow'
  | 'updateDraftSetRow'
  | 'addDraftExercise'
  | 'updateDraftExercise'
  | 'moveDraftExercise'
  | 'removeDraftExercise'
  | 'addSetToExercise'
  | 'updateExerciseSet'
  | 'removeExerciseSet'
  | 'createTemplateFromDraft'
  | 'saveEditedPlannedWorkout'
  | 'setMode'
>;

export function CreateWorkoutCard({
  mode,
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
  createTemplateFromDraft,
  saveEditedPlannedWorkout,
  setMode,
}: CreateWorkoutCardProps) {
  const isEditMode = mode === 'edit';
  const canAddExercise =
    draftExerciseName.trim().length > 0 && draftTargetSectionId.length > 0;
  const [dragItem, setDragItem] = useState<
    | { type: 'section'; sectionId: string }
    | { type: 'exercise'; sectionId: string; exerciseId: string }
    | null
  >(null);

  useEffect(() => {
    if (mode !== 'create' && mode !== 'edit') {
      return;
    }

    document.body.classList.add('workout-modal-open');

    return () => {
      document.body.classList.remove('workout-modal-open');
    };
  }, [mode]);

  if (mode !== 'create' && mode !== 'edit') {
    return null;
  }

  const handleDragOver = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  const handleSectionDrop = (targetSectionId: string) => {
    if (!dragItem) {
      return;
    }

    if (dragItem.type === 'section') {
      moveDraftSection(dragItem.sectionId, targetSectionId);
      setDragItem(null);
      return;
    }

    moveDraftExercise(dragItem.sectionId, targetSectionId, dragItem.exerciseId);
    setDragItem(null);
  };

  const handleExerciseDrop = (
    targetSectionId: string,
    targetExerciseId: string,
  ) => {
    if (!dragItem || dragItem.type !== 'exercise') {
      return;
    }

    moveDraftExercise(
      dragItem.sectionId,
      targetSectionId,
      dragItem.exerciseId,
      targetExerciseId,
    );
    setDragItem(null);
  };

  return (
    <section className={styles.formFullScreen}>
      <div className={styles.formFullScreenInner}>
        <div
          className={`${styles.editorCard} ${styles.formFullScreenCard}`}
          role='dialog'
          aria-modal='true'
          aria-label={isEditMode ? 'Modifica allenamento' : 'Crea allenamento'}
        >
          <article>
            <div className={styles.modalHeader}>
              <h3 className={styles.cardTitle}>
                {isEditMode
                  ? 'Modifica allenamento programmato'
                  : 'Crea allenamento da zero'}
              </h3>
              <button
                type='button'
                className={styles.secondaryButton}
                onClick={() => setMode('none')}
              >
                Chiudi
              </button>
            </div>

            <p className={styles.copyTitle}>Nome allenamento</p>
            <input
              id='draft-workout-name'
              className={styles.textInput}
              placeholder='Nome allenamento'
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              aria-label='Nome allenamento'
            />
            <p className={styles.copyTitle}>Note</p>
            <textarea
              id='draft-workout-notes'
              className={styles.textArea}
              placeholder='Note allenamento'
              value={draftNotes}
              onChange={(event) => setDraftNotes(event.target.value)}
              aria-label='Note allenamento'
            />

            <p className={styles.copyTitle}>Sezione</p>
            <div className={styles.inlineEditor}>
              <input
                id='draft-section-name'
                className={styles.textInput}
                placeholder='Nome sezione (es. Main, Riscaldamento)'
                value={draftSectionName}
                onChange={(event) => setDraftSectionName(event.target.value)}
                aria-label='Nome sezione'
              />
              <button
                type='button'
                className={styles.secondaryButton}
                onClick={addDraftSection}
              >
                Aggiungi sezione
              </button>
            </div>

            {draftSections.length > 0 && (
              <>
                <p className={styles.copyTitle}>
                  Sezione destinazione esercizio
                </p>
                <select
                  className={styles.selectInput}
                  value={draftTargetSectionId}
                  onChange={(event) =>
                    setDraftTargetSectionId(event.target.value)
                  }
                  aria-label='Sezione destinazione esercizio'
                >
                  {draftSections.map((section) => (
                    <option
                      key={section.id}
                      value={section.id}
                    >
                      {section.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            <p className={styles.copyTitle}>Nuovo esercizio</p>
            <div className={styles.inlineEditor}>
              <input
                id='draft-exercise-name'
                className={styles.textInput}
                placeholder='Nome esercizio'
                value={draftExerciseName}
                onChange={(event) => setDraftExerciseName(event.target.value)}
                aria-label='Nome esercizio'
              />
              <select
                id='draft-exercise-kind'
                className={styles.selectInput}
                value={draftExerciseKind}
                onChange={(event) =>
                  setDraftExerciseKind(event.target.value as ExerciseKind)
                }
                aria-label='Tipo esercizio'
              >
                <option value='load_reps'>Reps + Kg</option>
                <option value='time'>Tempo</option>
              </select>
              <button
                type='button'
                className={styles.pillButton}
                onClick={addDraftExercise}
                disabled={!canAddExercise}
              >
                Aggiungi esercizio
              </button>
            </div>

            <p className={styles.copyTitle}>Set target</p>
            {draftExerciseKind === 'load_reps' ? (
              <>
                <div className={styles.setHeadRow}>
                  <span className={styles.setHeadSpacer} />
                  <span className={styles.setHeadCell}>Kg target</span>
                  <span className={styles.setHeadCell}>Reps target</span>
                  <span className={styles.setHeadCell}>RPE</span>
                  <span className={styles.setHeadCell}>Azione</span>
                </div>
                {draftSetRows.map((setRow, index) => (
                  <div
                    key={setRow.id}
                    className={styles.setRow}
                  >
                    <span className={styles.setIndex}>Set {index + 1}</span>
                    <input
                      className={styles.setInput}
                      type='number'
                      min={0}
                      step={0.5}
                      value={setRow.loadKg ?? 0}
                      aria-label={`Set ${index + 1} chilogrammi target`}
                      onChange={(event) =>
                        updateDraftSetRow(setRow.id, {
                          loadKg: Number.isNaN(event.target.valueAsNumber)
                            ? 0
                            : Math.max(0, event.target.valueAsNumber),
                        })
                      }
                    />
                    <input
                      className={styles.setInput}
                      type='number'
                      min={1}
                      value={setRow.targetReps ?? 1}
                      aria-label={`Set ${index + 1} ripetizioni target`}
                      onChange={(event) =>
                        updateDraftSetRow(setRow.id, {
                          targetReps: Number.isNaN(event.target.valueAsNumber)
                            ? 1
                            : Math.max(1, event.target.valueAsNumber),
                        })
                      }
                    />
                    <input
                      className={styles.setInput}
                      type='number'
                      min={1}
                      max={10}
                      step={0.5}
                      value={setRow.rpe ?? 7}
                      aria-label={`Set ${index + 1} RPE target`}
                      onChange={(event) =>
                        updateDraftSetRow(setRow.id, {
                          rpe: Number.isNaN(event.target.valueAsNumber)
                            ? 7
                            : Math.max(
                                1,
                                Math.min(10, event.target.valueAsNumber),
                              ),
                        })
                      }
                    />
                    <button
                      type='button'
                      className={styles.dangerButtonCompact}
                      onClick={() => removeDraftSetRow(setRow.id)}
                      aria-label={`Rimuovi set ${index + 1}`}
                    >
                      Rimuovi
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className={styles.setHeadRowTime}>
                  <span className={styles.setHeadSpacer} />
                  <span className={styles.setHeadCellWide}>Secondi target</span>
                  <span className={styles.setHeadCell}>Azione</span>
                </div>
                {draftSetRows.map((setRow, index) => (
                  <div
                    key={setRow.id}
                    className={styles.setRow}
                  >
                    <span className={styles.setIndex}>Set {index + 1}</span>
                    <input
                      className={styles.setInputWide}
                      type='number'
                      min={1}
                      value={setRow.targetSec ?? 30}
                      aria-label={`Set ${index + 1} secondi target`}
                      onChange={(event) =>
                        updateDraftSetRow(setRow.id, {
                          targetSec: Number.isNaN(event.target.valueAsNumber)
                            ? 1
                            : Math.max(1, event.target.valueAsNumber),
                        })
                      }
                    />
                    <button
                      type='button'
                      className={styles.dangerButtonCompact}
                      onClick={() => removeDraftSetRow(setRow.id)}
                      aria-label={`Rimuovi set ${index + 1}`}
                    >
                      Rimuovi
                    </button>
                  </div>
                ))}
              </>
            )}

            <div className={styles.primaryActions}>
              <button
                type='button'
                className={styles.secondaryButton}
                onClick={addDraftSetRow}
              >
                Aggiungi set
              </button>
            </div>

            <p className={styles.copyTitle}>Struttura creata</p>
            {draftSections.length === 0 && (
              <p className={styles.copyEmpty}>Aggiungi almeno una sezione.</p>
            )}

            {draftSections.map((section) => (
              <div
                key={section.id}
                className={styles.previewSection}
                draggable
                onDragStart={() =>
                  setDragItem({ type: 'section', sectionId: section.id })
                }
                onDragOver={handleDragOver}
                onDrop={() => handleSectionDrop(section.id)}
              >
                <div className={styles.exerciseTop}>
                  <input
                    className={styles.textInput}
                    value={section.name}
                    placeholder='Nome sezione'
                    aria-label='Modifica nome sezione'
                    onChange={(event) =>
                      updateDraftSection(section.id, event.target.value)
                    }
                  />
                  <button
                    type='button'
                    className={styles.dangerButtonCompact}
                    onClick={() => removeDraftSection(section.id)}
                  >
                    Elimina sezione
                  </button>
                </div>

                {section.exercises.length === 0 && (
                  <p className={styles.copyEmpty}>
                    Nessun esercizio in questa sezione.
                  </p>
                )}

                {section.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={styles.exerciseCard}
                    draggable
                    onDragStart={() =>
                      setDragItem({
                        type: 'exercise',
                        sectionId: section.id,
                        exerciseId: exercise.id,
                      })
                    }
                    onDragOver={handleDragOver}
                    onDrop={() => handleExerciseDrop(section.id, exercise.id)}
                  >
                    <div className={styles.inlineEditor}>
                      <input
                        className={styles.textInput}
                        value={exercise.name}
                        placeholder='Nome esercizio'
                        aria-label='Modifica nome esercizio'
                        onChange={(event) =>
                          updateDraftExercise(section.id, exercise.id, {
                            name: event.target.value,
                          })
                        }
                      />
                      <select
                        className={styles.selectInput}
                        value={exercise.kind}
                        aria-label='Modifica tipo esercizio'
                        onChange={(event) =>
                          updateDraftExercise(section.id, exercise.id, {
                            kind: event.target.value as ExerciseKind,
                          })
                        }
                      >
                        <option value='load_reps'>Reps + Kg</option>
                        <option value='time'>Tempo</option>
                      </select>
                      <button
                        type='button'
                        className={styles.dangerButtonCompact}
                        onClick={() =>
                          removeDraftExercise(section.id, exercise.id)
                        }
                      >
                        Elimina esercizio
                      </button>
                    </div>

                    {exercise.kind === 'load_reps' ? (
                      <>
                        <div className={styles.setHeadRow}>
                          <span className={styles.setHeadSpacer} />
                          <span className={styles.setHeadCell}>Kg target</span>
                          <span className={styles.setHeadCell}>
                            Reps target
                          </span>
                          <span className={styles.setHeadCell}>RPE</span>
                          <span className={styles.setHeadCell}>Azione</span>
                        </div>

                        {exercise.sets.map((setRow, index) => (
                          <div
                            key={setRow.id}
                            className={styles.setRow}
                          >
                            <span className={styles.setIndex}>
                              Set {index + 1}
                            </span>
                            <input
                              className={styles.setInput}
                              type='number'
                              min={0}
                              step={0.5}
                              value={setRow.loadKg ?? 0}
                              aria-label={`${exercise.name} set ${index + 1} chilogrammi target`}
                              onChange={(event) =>
                                updateExerciseSet(
                                  section.id,
                                  exercise.id,
                                  setRow.id,
                                  {
                                    loadKg: Number.isNaN(
                                      event.target.valueAsNumber,
                                    )
                                      ? 0
                                      : Math.max(0, event.target.valueAsNumber),
                                  },
                                )
                              }
                            />
                            <input
                              className={styles.setInput}
                              type='number'
                              min={1}
                              value={setRow.targetReps ?? 1}
                              aria-label={`${exercise.name} set ${index + 1} ripetizioni target`}
                              onChange={(event) =>
                                updateExerciseSet(
                                  section.id,
                                  exercise.id,
                                  setRow.id,
                                  {
                                    targetReps: Number.isNaN(
                                      event.target.valueAsNumber,
                                    )
                                      ? 1
                                      : Math.max(1, event.target.valueAsNumber),
                                  },
                                )
                              }
                            />
                            <input
                              className={styles.setInput}
                              type='number'
                              min={1}
                              max={10}
                              step={0.5}
                              value={setRow.rpe ?? 7}
                              aria-label={`${exercise.name} set ${index + 1} RPE target`}
                              onChange={(event) =>
                                updateExerciseSet(
                                  section.id,
                                  exercise.id,
                                  setRow.id,
                                  {
                                    rpe: Number.isNaN(
                                      event.target.valueAsNumber,
                                    )
                                      ? 7
                                      : Math.max(
                                          1,
                                          Math.min(
                                            10,
                                            event.target.valueAsNumber,
                                          ),
                                        ),
                                  },
                                )
                              }
                            />
                            <button
                              type='button'
                              className={styles.dangerButtonCompact}
                              onClick={() =>
                                removeExerciseSet(
                                  section.id,
                                  exercise.id,
                                  setRow.id,
                                )
                              }
                            >
                              Rimuovi
                            </button>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className={styles.setHeadRowTime}>
                          <span className={styles.setHeadSpacer} />
                          <span className={styles.setHeadCellWide}>
                            Secondi target
                          </span>
                          <span className={styles.setHeadCell}>Azione</span>
                        </div>
                        {exercise.sets.map((setRow, index) => (
                          <div
                            key={setRow.id}
                            className={styles.setRow}
                          >
                            <span className={styles.setIndex}>
                              Set {index + 1}
                            </span>
                            <input
                              className={styles.setInputWide}
                              type='number'
                              min={1}
                              value={setRow.targetSec ?? 30}
                              aria-label={`${exercise.name} set ${index + 1} secondi target`}
                              onChange={(event) =>
                                updateExerciseSet(
                                  section.id,
                                  exercise.id,
                                  setRow.id,
                                  {
                                    targetSec: Number.isNaN(
                                      event.target.valueAsNumber,
                                    )
                                      ? 1
                                      : Math.max(1, event.target.valueAsNumber),
                                  },
                                )
                              }
                            />
                            <button
                              type='button'
                              className={styles.dangerButtonCompact}
                              onClick={() =>
                                removeExerciseSet(
                                  section.id,
                                  exercise.id,
                                  setRow.id,
                                )
                              }
                            >
                              Rimuovi
                            </button>
                          </div>
                        ))}
                      </>
                    )}

                    <div className={styles.primaryActions}>
                      <button
                        type='button'
                        className={styles.secondaryButton}
                        onClick={() =>
                          addSetToExercise(section.id, exercise.id)
                        }
                      >
                        Aggiungi set
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {draftSections.length > 0 && (
              <div className={styles.primaryActions}>
                <button
                  type='button'
                  className={styles.dangerButton}
                  onClick={clearDraftSections}
                >
                  Elimina tutte le sezioni
                </button>
              </div>
            )}

            <div className={styles.primaryActions}>
              <button
                type='button'
                className={styles.primaryButton}
                onClick={
                  isEditMode
                    ? saveEditedPlannedWorkout
                    : createTemplateFromDraft
                }
              >
                {isEditMode ? 'Salva modifiche' : 'Salva e assegna al giorno'}
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
    </section>
  );
}
