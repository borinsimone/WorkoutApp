import { useEffect, useMemo, useState } from 'react';
import { formatDateLabel, formatDuration, formatStartTime } from '../lib/date';
import type { WorkoutState } from '../hooks/use-workout-state';
import styles from '../styles/page.module.scss';

type DayStateCardProps = Pick<
  WorkoutState,
  | 'selectedDate'
  | 'isToday'
  | 'currentDayStatus'
  | 'selectedSession'
  | 'selectedTemplate'
  | 'saveSessionAsTemplate'
  | 'copyFromSession'
  | 'setMode'
  | 'startSession'
  | 'deleteCompletedSession'
>;

type DayStateCardExtraProps = {
  openAssistant: () => void;
};

export function DayStateCard({
  selectedDate,
  isToday,
  currentDayStatus,
  selectedSession,
  selectedTemplate,
  saveSessionAsTemplate,
  copyFromSession,
  setMode,
  startSession,
  deleteCompletedSession,
  openAssistant,
}: DayStateCardProps & DayStateCardExtraProps) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (selectedSession?.status !== 'in_progress') {
      return;
    }

    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [selectedSession?.status]);

  const inProgressDurationSec = useMemo(() => {
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

  return (
    <article className={styles.stateCard}>
      <div className={styles.stateHeader}>
        <div>
          <p className={styles.stateDate}>{formatDateLabel(selectedDate)}</p>
          <h2 className={styles.stateTitle}>
            {isToday ? 'Oggi' : 'Dettaglio giorno'}
          </h2>
        </div>
        <span className={styles.statusBadge}>{currentDayStatus}</span>
      </div>

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
            <button
              type='button'
              className={styles.dangerButton}
              onClick={() => {
                const shouldDelete = window.confirm(
                  'Eliminare questo allenamento completato? Questa azione non si può annullare.',
                );

                if (shouldDelete) {
                  deleteCompletedSession(selectedSession.id);
                }
              }}
            >
              Elimina completato
            </button>
          </div>
        </div>
      )}

      {selectedSession?.status === 'in_progress' && (
        <div className={styles.infoStack}>
          <p className={styles.infoLine}>
            Sessione in corso: {selectedSession.nameSnapshot}
          </p>
          <p className={styles.infoLine}>
            Inizio: {formatStartTime(selectedSession.startedAt)}
          </p>
          <p className={styles.infoLine}>
            Durata: {formatDuration(inProgressDurationSec)}
          </p>
          <button
            type='button'
            className={styles.primaryButton}
            onClick={openAssistant}
          >
            Apri assistant
          </button>
        </div>
      )}

      {!selectedSession && selectedTemplate && (
        <div className={styles.infoStack}>
          <p className={styles.infoLine}>
            Allenamento pianificato: {selectedTemplate.name}
          </p>
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
              Inizia allenamento
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
            Nessun allenamento pianificato. Crea da zero o copia uno esistente.
          </p>
          <div className={styles.primaryActions}>
            <button
              type='button'
              className={styles.primaryButton}
              onClick={() => setMode('create')}
            >
              Crea allenamento
            </button>
            <button
              type='button'
              className={styles.secondaryButton}
              onClick={() => setMode('copy')}
            >
              Copia allenamento
            </button>
          </div>
          <div className={styles.comingSoon}>
            Crea con IA · Prossimamente (Pro)
          </div>
        </div>
      )}
    </article>
  );
}
