import { formatDateLabel, formatTimer } from '../lib/date';
import type { WorkoutState } from '../hooks/use-workout-state';
import styles from '../styles/page.module.scss';

type DayStateCardProps = Pick<
  WorkoutState,
  | 'selectedDate'
  | 'isToday'
  | 'currentDayStatus'
  | 'selectedSession'
  | 'selectedTemplate'
  | 'restTimerSec'
  | 'restTimerRunning'
  | 'startRestTimer'
  | 'toggleRestTimer'
  | 'resetRestTimer'
  | 'updateSessionSet'
  | 'toggleSetDone'
  | 'completeSession'
  | 'saveSessionAsTemplate'
  | 'copyFromSession'
  | 'setMode'
  | 'startSession'
>;

export function DayStateCard({
  selectedDate,
  isToday,
  currentDayStatus,
  selectedSession,
  selectedTemplate,
  restTimerSec,
  restTimerRunning,
  startRestTimer,
  toggleRestTimer,
  resetRestTimer,
  updateSessionSet,
  toggleSetDone,
  completeSession,
  saveSessionAsTemplate,
  copyFromSession,
  setMode,
  startSession,
}: DayStateCardProps) {
  return (
    <article className={styles.stateCard}>
      <div className={styles.stateHeader}>
        <div>
          <p className={styles.stateDate}>{formatDateLabel(selectedDate)}</p>
          <h2 className={styles.stateTitle}>{isToday ? 'Oggi' : 'Dettaglio giorno'}</h2>
        </div>
        <span className={styles.statusBadge}>{currentDayStatus}</span>
      </div>

      {selectedSession?.status === 'in_progress' && (
        <>
          <div className={styles.timerCard}>
            <p className={styles.timerLabel}>Recupero</p>
            <p className={styles.timerValue}>{formatTimer(restTimerSec)}</p>
            <div className={styles.timerActions}>
              {[60, 90, 120].map((seconds) => (
                <button
                  key={seconds}
                  type='button'
                  className={styles.pillButton}
                  onClick={() => startRestTimer(seconds)}
                >
                  {seconds}s
                </button>
              ))}
              <button
                type='button'
                className={styles.pillButton}
                onClick={toggleRestTimer}
              >
                {restTimerRunning ? 'Pausa' : 'Avvia'}
              </button>
              <button
                type='button'
                className={styles.pillButton}
                onClick={resetRestTimer}
              >
                Reset
              </button>
            </div>
          </div>

          {selectedSession.sectionsSnapshot.map((section) => (
            <div
              key={section.id}
              className={styles.sectionBlock}
            >
              <p className={styles.sectionTitle}>{section.name}</p>
              {section.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={styles.exerciseCard}
                >
                  <div className={styles.exerciseTop}>
                    <p className={styles.exerciseName}>{exercise.name}</p>
                    <button
                      type='button'
                      className={styles.linkButton}
                      onClick={() => startRestTimer(exercise.restPolicySec ?? 90)}
                    >
                      Recupero {exercise.restPolicySec ?? 90}s
                    </button>
                  </div>

                  {exercise.sets.map((set) => (
                    <div
                      key={set.id}
                      className={styles.setRow}
                    >
                      <span className={styles.setIndex}>Set {set.order}</span>
                      {exercise.metricType === 'load_reps' ? (
                        <>
                          <input
                            className={styles.setInput}
                            type='number'
                            value={set.actualKg ?? 0}
                            onChange={(event) =>
                              updateSessionSet(section.id, exercise.id, set.id, {
                                actualKg: Number(event.target.value),
                              })
                            }
                            aria-label='kg'
                          />
                          <input
                            className={styles.setInput}
                            type='number'
                            value={set.actualReps ?? 0}
                            onChange={(event) =>
                              updateSessionSet(section.id, exercise.id, set.id, {
                                actualReps: Number(event.target.value),
                              })
                            }
                            aria-label='reps'
                          />
                          <input
                            className={styles.setInput}
                            type='number'
                            value={set.actualRpe ?? 0}
                            onChange={(event) =>
                              updateSessionSet(section.id, exercise.id, set.id, {
                                actualRpe: Number(event.target.value),
                              })
                            }
                            aria-label='rpe'
                          />
                        </>
                      ) : (
                        <input
                          className={styles.setInputWide}
                          type='number'
                          value={set.actualDurationSec ?? 0}
                          onChange={(event) =>
                            updateSessionSet(section.id, exercise.id, set.id, {
                              actualDurationSec: Number(event.target.value),
                            })
                          }
                          aria-label='durata secondi'
                        />
                      )}

                      <button
                        type='button'
                        className={`${styles.doneButton} ${
                          set.completed ? styles.doneActive : ''
                        }`}
                        onClick={() =>
                          toggleSetDone(
                            section.id,
                            exercise.id,
                            set.id,
                            !set.completed,
                          )
                        }
                      >
                        {set.completed ? 'Fatto' : 'Segna'}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          <div className={styles.primaryActions}>
            <button
              type='button'
              className={styles.primaryButton}
              onClick={completeSession}
            >
              Completa allenamento
            </button>
            <button
              type='button'
              className={styles.secondaryButton}
              onClick={saveSessionAsTemplate}
            >
              Salva come template
            </button>
          </div>
        </>
      )}

      {selectedSession?.status === 'completed' && (
        <div className={styles.infoStack}>
          <p className={styles.infoLine}>
            Sessione completata: {selectedSession.nameSnapshot}
          </p>
          <div className={styles.primaryActions}>
            <button
              type='button'
              className={styles.primaryButton}
              onClick={() => copyFromSession(selectedSession)}
            >
              Duplica su questo giorno
            </button>
            <button
              type='button'
              className={styles.secondaryButton}
              onClick={saveSessionAsTemplate}
            >
              Salva come template
            </button>
          </div>
        </div>
      )}

      {!selectedSession && selectedTemplate && (
        <div className={styles.infoStack}>
          <p className={styles.infoLine}>Allenamento pianificato: {selectedTemplate.name}</p>
          {selectedTemplate.sections.map((section) => (
            <div
              key={section.id}
              className={styles.previewSection}
            >
              <p className={styles.previewTitle}>{section.name}</p>
              <p className={styles.previewValue}>
                {section.exercises.map((exercise) => exercise.name).join(' • ')}
              </p>
            </div>
          ))}
          <div className={styles.primaryActions}>
            <button
              type='button'
              className={styles.primaryButton}
              onClick={startSession}
            >
              Inizia workout
            </button>
            <button
              type='button'
              className={styles.secondaryButton}
              onClick={() => setMode('copy')}
            >
              Sostituisci con copia
            </button>
          </div>
        </div>
      )}

      {!selectedSession && !selectedTemplate && (
        <div className={styles.infoStack}>
          <p className={styles.infoLine}>
            Nessun workout pianificato. Crea da zero o copia uno esistente.
          </p>
          <div className={styles.primaryActions}>
            <button
              type='button'
              className={styles.primaryButton}
              onClick={() => setMode('create')}
            >
              Crea workout
            </button>
            <button
              type='button'
              className={styles.secondaryButton}
              onClick={() => setMode('copy')}
            >
              Copia workout
            </button>
          </div>
          <div className={styles.comingSoon}>Crea con IA · Coming soon (Pro)</div>
        </div>
      )}
    </article>
  );
}
