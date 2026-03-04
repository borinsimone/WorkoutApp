import { useEffect, useMemo, useState } from 'react';
import {
  formatDateLabel,
  formatDuration,
  formatStartTime,
  formatTimer,
} from '../lib/date';
import type { WorkoutState } from '../hooks/use-workout-state';
import styles from '../styles/page.module.scss';

type WorkoutAssistantPageProps = Pick<
  WorkoutState,
  | 'selectedDate'
  | 'selectedSession'
  | 'restTimerSec'
  | 'restTimerRunning'
  | 'startRestTimer'
  | 'toggleRestTimer'
  | 'resetRestTimer'
  | 'updateSessionSet'
  | 'toggleSetDone'
  | 'completeSession'
  | 'saveSessionAsTemplate'
>;

type WorkoutAssistantExtraProps = {
  closeAssistant: () => void;
};

export function WorkoutAssistantPage({
  selectedDate,
  selectedSession,
  restTimerSec,
  restTimerRunning,
  startRestTimer,
  toggleRestTimer,
  resetRestTimer,
  updateSessionSet,
  toggleSetDone,
  completeSession,
  saveSessionAsTemplate,
  closeAssistant,
}: WorkoutAssistantPageProps & WorkoutAssistantExtraProps) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [customMinutes, setCustomMinutes] = useState(1);
  const [customSeconds, setCustomSeconds] = useState(30);

  useEffect(() => {
    if (selectedSession?.status !== 'in_progress') {
      return;
    }

    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [selectedSession?.status]);

  const workoutDurationSec = useMemo(() => {
    if (
      selectedSession?.status !== 'in_progress' ||
      !selectedSession.startedAt
    ) {
      return 0;
    }

    const startedAtMs = new Date(selectedSession.startedAt).getTime();
    if (Number.isNaN(startedAtMs)) {
      return 0;
    }

    return Math.max(0, Math.floor((nowMs - startedAtMs) / 1000));
  }, [selectedSession?.status, selectedSession?.startedAt, nowMs]);

  const applyCustomRestTimer = () => {
    const totalSeconds = customMinutes * 60 + customSeconds;
    if (totalSeconds <= 0) {
      return;
    }

    startRestTimer(totalSeconds);
  };

  if (!selectedSession || selectedSession.status !== 'in_progress') {
    return null;
  }

  return (
    <section
      className={styles.assistantPage}
      aria-label='Assistente allenamento'
    >
      <div className={styles.assistantInner}>
        <div className={styles.assistantTopBar}>
          <button
            type='button'
            className={styles.assistantCloseButton}
            onClick={closeAssistant}
          >
            Esci
          </button>
        </div>

        <div className={styles.assistantHeader}>
          <div>
            <p className={styles.stateDate}>{formatDateLabel(selectedDate)}</p>
            <h2 className={styles.stateTitle}>Assistente allenamento</h2>
          </div>
          <span className={styles.statusBadge}>In corso</span>
        </div>

        <div className={styles.previewSection}>
          <p className={styles.previewTitle}>Sessione</p>
          <p className={styles.previewValue}>
            Inizio: {formatStartTime(selectedSession.startedAt)}
          </p>
          <p className={styles.previewValue}>
            Durata: {formatDuration(workoutDurationSec)}
          </p>
        </div>

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

          <div className={styles.customTimerRow}>
            <p className={styles.timerLabel}>Tempo personalizzato</p>
            <div className={styles.iosPicker}>
              <div className={styles.pickerColumn}>
                <label
                  htmlFor='custom-rest-minutes'
                  className={styles.pickerLabel}
                >
                  Min
                </label>
                <select
                  id='custom-rest-minutes'
                  className={styles.pickerSelect}
                  value={customMinutes}
                  onChange={(event) =>
                    setCustomMinutes(Number(event.target.value))
                  }
                >
                  {Array.from({ length: 21 }, (_, index) => (
                    <option
                      key={`m-${index}`}
                      value={index}
                    >
                      {String(index).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <span className={styles.pickerDivider}>:</span>

              <div className={styles.pickerColumn}>
                <label
                  htmlFor='custom-rest-seconds'
                  className={styles.pickerLabel}
                >
                  Sec
                </label>
                <select
                  id='custom-rest-seconds'
                  className={styles.pickerSelect}
                  value={customSeconds}
                  onChange={(event) =>
                    setCustomSeconds(Number(event.target.value))
                  }
                >
                  {Array.from({ length: 60 }, (_, index) => (
                    <option
                      key={`s-${index}`}
                      value={index}
                    >
                      {String(index).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type='button'
                className={styles.pickerApplyButton}
                onClick={applyCustomRestTimer}
              >
                Imposta
              </button>
            </div>
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

                {exercise.metricType === 'load_reps' ? (
                  <div className={styles.setHeadRow}>
                    <span className={styles.setHeadSpacer} />
                    <span className={styles.setHeadCell}>kg</span>
                    <span className={styles.setHeadCell}>reps</span>
                    <span className={styles.setHeadCell}>RPE</span>
                    <span className={styles.setHeadCell}>Stato</span>
                  </div>
                ) : (
                  <div className={styles.setHeadRowTime}>
                    <span className={styles.setHeadSpacer} />
                    <span className={styles.setHeadCellWide}>Durata (sec)</span>
                    <span className={styles.setHeadCell}>Stato</span>
                  </div>
                )}

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
      </div>
    </section>
  );
}
